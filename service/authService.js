import bcrypt from "bcrypt";

import UserDto from "../dto/UserDto.js";
import User from "../models/User.js";
import Role from "../models/Role.js";
import ApiError from "../exceptions/ApiError.js";
import tokenService from "./tokenService.js";

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
    await user.save();

    const userDto = new UserDto(user);

    return userDto;
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

    const userDto = new UserDto(user);
    const token = tokenService.generateAccessToken(user._id, user.role);

    return { token, user: userDto };
  }
}

export default new AuthService();
