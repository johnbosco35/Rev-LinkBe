const { validate } = require("../../model/announcement");
const { AccountError } = require("../error-handler");

async function validateAddAnnouncement(req, res, next) {
  const { error } = validate(req.body);
  if (error) {
    return next(new AccountError("bad_request", error.details[0].message));
  }

  next();
}

module.exports = {
  validateAddAnnouncement,
};
