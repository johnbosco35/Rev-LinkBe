const { validate } = require("../../model/subject");
const { AccountError } = require("../error-handler");

async function validateAddSubject(req, res, next) {
  const { error } = validate(req.body);
  if (error) {
    return next(new AccountError("bad_request", error.details[0].message));
  }

  next();
}

module.exports = {
  validateAddSubject,
};
