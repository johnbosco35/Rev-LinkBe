const { AccountError } = require("../error-handler");
const { validate } = require("../../model/class-level");

async function validateAddClassLevel(req, res, next) {
  const { error } = validate(req.body);
  if (error) {
    return next(new AccountError("bad_request", error.details[0].message));
  }

  next();
}

module.exports = {
  validateAddClassLevel,
};
