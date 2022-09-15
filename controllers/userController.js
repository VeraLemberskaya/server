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

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      const result = await userService.forgotPassword(email);

      if (result) {
        res.status(200).send(`Activation link was send on email ${email}`);
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
        res.redirect(
          `${process.env.CLIENT_URL}/reset-password/${userId}/${token}`
        );
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
        res.status(200).send("Password reset successfully done.");
      }
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();
