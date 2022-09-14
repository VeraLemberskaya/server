import bcrypt from "bcrypt";

import User from "../models/User.js";
import UserDto from "../dto/UserDto.js";
import ApiError from "../exceptions/ApiError.js";

class UserService {
  async update(id, { name, surname, email }) {
    const user = await User.findById(id);
    if (!user) {
      throw ApiError.badRequest(`User with id ${id} doesn't exist.`);
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, surname, email },
      {
        new: true,
      }
    );

    const userDto = new UserDto(updatedUser);
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

    const hashedPassword = await bcrypt.hash(newPassword, 5);

    await User.updateOne({ _id: id }, { password: hashedPassword });

    return true;
  }
}

export default new UserService();
