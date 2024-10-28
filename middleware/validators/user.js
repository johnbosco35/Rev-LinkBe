const { validate: validateStudent } = require("../../model/student");
const { validate: validateTeacher } = require("../../model/teacher");
const { validate } = require("../../model/subject-allocation");
const { User } = require("../../model");
const { AccountError } = require("../error-handler");
const { validateAdminLogin: validateLoginAdmin } = require("../../model/admin");
const {
  validateAddPrivilege,
  validateChangePassword: changePasswordValidation,
} = require("../../model/user");

async function email_exists(req, res, next) {
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    return next(
      new AccountError("email_exists", "Email address already exist.")
    );
  }

  next();
}

async function validateAddStudent(req, res, next) {
  const { error } = validateStudent(req.body);
  if (error) {
    return next(new AccountError("bad_request", error.details[0].message));
  }

  next();
}

async function validateAddTeacher(req, res, next) {
  const { error } = validateTeacher(req.body);
  if (error) {
    return next(new AccountError("bad_request", error.details[0].message));
  }

  next();
}

async function validateLogin(req, res, next) {
  const { error } = validateLoginAdmin(req.body);
  if (error) {
    return next(new AccountError("bad_request", error.details[0].message));
  }

  next();
}

async function validatePrivilege(req, res, next) {
  const { error } = validateAddPrivilege(req.body);
  if (error) {
    return next(new AccountError("bad_request", error.details[0].message));
  }

  next();
}

async function validateSubjectAllocation(req, res, next) {
  const { error } = validate(req.body);
  if (error) {
    return next(new AccountError("bad_request", error.details[0].message));
  }

  next();
}

async function validateChangePassword(req, res, next) {
  const { error } = changePasswordValidation(req.body);
  if (error) {
    return next(new AccountError("bad_request", error.details[0].message));
  }

  next();
}

module.exports = {
  email_exists,
  validateAddTeacher,
  validateAddStudent,
  validateLogin,
  validatePrivilege,
  validateSubjectAllocation,
  validateChangePassword,
};
