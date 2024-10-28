const { UnauthorizedError } = require("./error-handler");
const { decode } = require("./helper");

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return next(new UnauthorizedError());
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(new UnauthorizedError());
    }

    const decoded = decode(token);
    req.id = decoded.id;
    req.code = decoded.code;
    req._userType = decoded._userType;

    next();
  } catch (error) {
    next(error);
  }
};
