const { AccountError } = require("../error-handler");
const { validate } = require("../../model/class-history");

async function validateAddClassHistory(req, res, next) {
  const { error } = validate(req.body);
  if (error) {
    return next(new AccountError("bad_request", error.details[0].message));
  }

  next();
}

module.exports = {
  validateAddClassHistory,
};
