const { validate } = require("../../model/term");
const { AccountError } = require("../error-handler");

async function validateAddTerm(req, res, next) {
  const { error } = validate(req.body);
  if (error) {
    return next(new AccountError("bad_request", error.details[0].message));
  }

  next();
}

module.exports = {
  validateAddTerm,
};
