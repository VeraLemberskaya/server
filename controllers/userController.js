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
      const { oldPassword, password } = req.body;

      const result = await userService.changePassword(
        req.userData.id,
        oldPassword,
        password
      );
      if (result) {
        return res.status(200).json({
          message: "Password has been successfully updated.",
        });
      }
    } catch (e) {
      next(e);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      const result = await userService.forgotPassword(email);

      if (result) {
        res.status(200).json({
          message: "Reset link was send to the email",
        });
      }
    } catch (e) {
      next(e);
    }
  }

  async verifyResetLink(req, res, next) {
    try {
      const { userId, token } = req.params;

      const result = await userService.verifyResetLink(userId, token);

      if (result) {
        res.status(200).json({
          message: "Email verified successfully.",
        });
      }
    } catch (e) {
      next(e);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { userId, token } = req.params;
      const { password } = req.body;

      const result = await userService.resetPassword(userId, token, password);

      if (result) {
        res.status(200).json({
          message: "Password reset successfully done.",
        });
      }
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();
