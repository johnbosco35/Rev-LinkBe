const { ForbiddenError } = require("./error-handler");

module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req._userType)) {
      return next(new ForbiddenError("Access denied"));
    }
    next();
  };
};
