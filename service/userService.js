import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

import User from "../models/User.js";
import Token from "../models/Token.js";
import UserPasswords from "../models/UserPasswords.js";
import UserDto from "../dto/UserDto.js";
import ApiError from "../exceptions/ApiError.js";
import mailService from "./mailService.js";

class UserService {
  async update(id, { name, surname, email }) {
    const user = await User.findById(id);

    if (!user) {
      throw ApiError.badRequest(`User with id ${id} doesn't exist.`);
    }

    user.name = name;
    user.surname = surname;
    user.email = email;
    user.save();

    const userDto = new UserDto(user);
    return userDto;
  }

  async changePassword(id, password, newPassword) {
    const user = await User.findById(id);
    if (!user) {
      throw ApiError.badRequest(`User with id ${id} doesn't exist.`);
    }
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      throw ApiError.badRequest("Password is not correct.");
    }

    const userPasswords = await UserPasswords.findOne(
      { userId: user._id },
      {
        prevPasswords: {
          $slice: 3,
        },
      }
    );

    const { prevPasswords } = userPasswords;

    if (
      prevPasswords.some((password) =>
        bcrypt.compareSync(newPassword, password)
      )
    ) {
      throw ApiError.badRequest("You already used such password.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 5);

    user.password = hashedPassword;
    user.save();

    userPasswords.prevPasswords = [hashedPassword, ...prevPasswords];
    userPasswords.save();

    return true;
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email });

    if (!user) {
      throw ApiError.badRequest(`User with email ${email} doesn't exist.`);
    }

    let token = await Token.findOne({ userId: user._id });

    if (!token) {
      token = new Token({
        userId: user._id,
        token: nanoid(64),
      });
    }

    const link = `${process.env.API_URL}${process.env.PORT}/api/users/reset-password/${user._id}/${token.token}`;

    await mailService.sendActivationMail(
      user.email,
      `Reset password on ${process.env.API_URL}${process.env.PORT}`,
      link
    );

    token.save();

    return true;
  }

  async verifyResetLink(userId, token) {
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      throw ApiError.badRequest("Link is invalid or expired.");
    }

    const tokenExists = await Token.exists({
      userId: userId,
      token: token,
    });

    if (!tokenExists) {
      throw ApiError.badRequest("Link is invalid or expired.");
    }

    return true;
  }

  async resetPassword(userId, token, password) {
    const verificationResult = await this.verifyResetLink(userId, token);

    if (verificationResult) {
      const user = await User.findById(userId);
      const activationToken = await Token.findOne({ userId });
      const userPasswords = await UserPasswords.findOne({ userId: user._id });

      const hashedPassword = await bcrypt.hash(password, 5);

      user.password = hashedPassword;
      await user.save();

      userPasswords.prevPasswords = [
        hashedPassword,
        ...userPasswords.prevPasswords,
      ];
      await userPasswords.save();

      await activationToken.delete();

      return true;
    } else {
      throw ApiError.badRequest("Link is invalid or expired.");
    }
  }
}

export default new UserService();
