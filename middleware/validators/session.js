const { validate } = require("../../model/session");
const { AccountError } = require("../error-handler");

const validateAddSession = async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) {
    return next(new AccountError("bad_request", error.details[0].message));
  }

  next();
};

module.exports = {
  validateAddSession,
};
