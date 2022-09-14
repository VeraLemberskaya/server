import * as dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET;

class TokenService {
  generateAccessToken(id, role) {
    const payload = {
      id,
      role,
    };

    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "1h" });
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, JWT_SECRET_KEY);
      return userData;
    } catch {
      return null;
    }
  }
}

export default new TokenService();
