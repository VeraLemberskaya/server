import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

import UserDto from "../dto/UserDto.js";
import User from "../models/User.js";
import Role from "../models/Role.js";
import ActivationToken from "../models/ActivationToken.js";
import UserPasswords from "../models/UserPasswords.js";
import ApiError from "../exceptions/ApiError.js";
import tokenService from "./tokenService.js";
import mailService from "./mailService.js";

class AuthService {
  async registration({ name, surname, email, password }) {
    const candidate = await User.exists({ email });
    if (candidate) {
      throw ApiError.badRequest(`User with email ${email} already exists.`);
    }

    const hashPassword = await bcrypt.hash(password, 5);
    const userRole = await Role.findOne({ name: "USER" });

    const user = new User({
      name,
      surname,
      email,
      password: hashPassword,
      role: userRole._id,
    });

    const activationToken = new ActivationToken({
      userId: user._id,
      activationToken: nanoid(64),
    });
    const link = `${process.env.BASE_URL}/auth/${user._id}/${activationToken.activationToken}`;

    mailService.sendActivationMail(
      user.email,
      `Activate your account on ${process.env.BASE_URL}`,
      link
    );

    await user.save();
    await activationToken.save();

    await UserPasswords.create({
      userId: user._id,
      prevPasswords: [user.password],
    });

    return true;
  }

  async activate(userId, token) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.badRequest("Link is invalid or expired.");
    }
    const activationToken = await ActivationToken.findOne({
      userId,
      activationToken: token,
    });

    if (!activationToken) {
      throw ApiError.badRequest("Link is invalid or expired.");
    }

    user.isActivated = true;
    await user.save();

    await activationToken.delete();

    return true;
  }

  async login(email, password) {
    const user = await User.findOne({ email }).populate("role", "-_id");
    if (!user) {
      throw new ApiError.badRequest(`User with email ${email} doesn't exist.`);
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      throw ApiError.badRequest("Incorrect password.");
    }

    if (!user.isActivated) {
      let activationToken = await ActivationToken.findOne({ userId: user._id });

      if (!activationToken) {
        activationToken = await new ActivationToken({
          userId: user._id,
          activationToken: nanoid(64),
        }).save();
      }
      const link = `${process.env.BASE_URL}/auth/${user._id}/${activationToken.activationToken}`;

      mailService.sendActivationMail(
        user.email,
        `Activate your account on ${process.env.BASE_URL}`,
        link
      );

      return true;
    }

    const userDto = new UserDto(user);
    const token = tokenService.generateAccessToken(user._id, user.role);

    return { token, user: userDto };
  }
}

export default new AuthService();
