import authService from "../service/authService.js";

class AuthController {
  async registration(req, res, next) {
    try {
      const { email, name, surname, password } = req.body;

      const user = await authService.registration({
        email,
        name,
        surname,
        password,
      });

      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const userData = await authService.login(email, password);

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
}

export default new AuthController();
