import ApiError from "../exceptions/ApiError.js";
import tokenService from "../service/tokenService.js";

const authMiddleware = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw ApiError.unauthorized();
    }
    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      throw ApiError.unauthorized();
    }

    const userData = tokenService.validateAccessToken(accessToken);

    if (!userData) {
      throw ApiError.unauthorized();
    }

    req.userData = userData;

    next();
  } catch (e) {
    throw ApiError.unauthorized();
  }
};

export default authMiddleware;
