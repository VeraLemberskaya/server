import * as dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

const JWT_ACCSESS_SECRET_KEY = process.env.JWT_ACCESS_SECRET_KEY;
const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;

class TokenService {
  generateTokens(id, role) {
    const payload = {
      id,
      role,
    };

    const accessToken = jwt.sign(payload, JWT_ACCSESS_SECRET_KEY, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET_KEY, {
      expiresIn: "7d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, JWT_REFRESH_SECRET_KEY);
      return userData;
    } catch {
      return null;
    }
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, JWT_ACCSESS_SECRET_KEY);
      return userData;
    } catch {
      return null;
    }
  }
}

export default new TokenService();
