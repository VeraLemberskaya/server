import authService from "../service/authService.js";
import ApiError from "../exceptions/ApiError.js";

class AuthController {
  async register(req, res, next) {
    try {
      const { email, name, surname, password } = req.body;

      const result = await authService.register({
        email,
        name,
        surname,
        password,
      });

      if (result) {
        return res.status(201).json({
          message: "Activation link was send to the email",
        });
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
        return res.status(200).json({
          message: "Account was successfully activated.",
        });
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
        throw ApiError.badRequest(
          "Email is not verified. Activation link was send to the email."
        );
      }

      const { accessToken, refreshToken, user } = result;

      res.cookie("token", refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.json({ accessToken, user });
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const cookies = req.cookies;
      if (!cookies?.token) res.sendStatus(204);
      res.clearCookie("token");
      return res.status(200).json({
        message: "Cookie cleared.",
      });
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { token } = req.cookies;

      const { accessToken, refreshToken, user } = await authService.refresh(
        token
      );

      res.cookie("token", refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.json({ accessToken, user });
    } catch (e) {
      next(e);
    }
  }
}

export default new AuthController();
