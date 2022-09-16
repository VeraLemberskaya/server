import authService from "../service/authService.js";

class AuthController {
  async registration(req, res, next) {
    try {
      const { email, name, surname, password } = req.body;

      const result = await authService.registration({
        email,
        name,
        surname,
        password,
      });

      if (result) {
        return res
          .status(200)
          .send(`Activation link was send on email ${email}`);
      }
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const { userId, token } = req.params;
      const result = await authService.activate(userId, token);

      if (result) {
        return res.status(200).send("User was successfully activated.");
      }
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      if (typeof result === "boolean" && result) {
        return res
          .status(200)
          .send(`Activation link was send on email ${email}`);
      }

      return res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

export default new AuthController();
