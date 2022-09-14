import userService from "../service/userService.js";

class UserController {
  async update(req, res, next) {
    try {
      const id = req.params.id;
      const { name, surname, email } = req.body;

      const user = await userService.update(id, { name, surname, email });

      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { password, newPassword } = req.body;

      const result = await userService.changePassword(
        req.userData.id,
        password,
        newPassword
      );

      return res.status(200).send(result);
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();
