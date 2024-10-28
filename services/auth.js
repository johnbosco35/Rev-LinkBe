const {
  AccountError,
  UnauthorizedError,
  BadRequestError,
} = require("../middleware/error-handler");
const { Admin, Teacher, Student } = require("../model");
const bcrypt = require("bcrypt");
const { encode, decode } = require("../middleware/helper");

async function adminLogin(req) {
  const { email, password, code } = req.body;

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) {
    throw new AccountError("invalid_credentials", "Invalid email or password");
  }

  const comparePassword = bcrypt.compareSync(password, admin.password);
  if (!comparePassword) {
    throw new AccountError("invalid_credentials", "Invalid email or password");
  }

  // TODO: check that the school code is valid school code

  const token = encode({ id: admin._id, code, _userType: admin._userType });

  return { token, user: admin };
}

async function adminChangePassword(req) {
  const { id } = req;
  const { oldPassword, newPassword } = req.body;

  const admin = await Admin.findById(id);
  if (!admin) {
    throw new AccountError("invalid_credentials", "No user found");
  }

  const comparePassword = bcrypt.compareSync(oldPassword, admin.password);
  if (!comparePassword) {
    throw new AccountError("invalid_credentials", "Incorrect password");
  }

  admin.password = bcrypt.hashSync(newPassword, 10);
  return admin.save();
}

async function teacherLogin(req) {
  const { email, password, code } = req.body;

  const teacher = await Teacher.findOne({ email: email.toLowerCase() });
  if (!teacher) {
    throw new AccountError("invalid_credentials", "Invalid email or password");
  }

  const comparePassword = bcrypt.compareSync(password, teacher.password);
  if (!comparePassword) {
    throw new AccountError("invalid_credentials", "Invalid email or password");
  }

  // TODO: check that the school code is valid school code

  const token = encode({ id: teacher._id, code, _userType: teacher._userType });

  return { token, user: teacher };
}

async function teacherChangePassword(req) {
  const { id } = req;
  const { oldPassword, newPassword } = req.body;

  const teacher = await Teacher.findById(id);
  if (!teacher) {
    throw new AccountError("invalid_credentials", "No user found");
  }

  const comparePassword = bcrypt.compareSync(oldPassword, teacher.password);
  if (!comparePassword) {
    throw new AccountError("invalid_credentials", "Incorrect password");
  }

  teacher.password = bcrypt.hashSync(newPassword, 10);
  return teacher.save();
}

async function studentLogin(req) {
  const { email, password, code } = req.body;

  const student = await Student.findOne({ email: email.toLowerCase() });
  if (!student) {
    throw new AccountError("invalid_credentials", "Invalid email or password");
  }

  const comparePassword = bcrypt.compareSync(password, student.password);
  if (!comparePassword) {
    throw new AccountError("invalid_credentials", "Invalid email or password");
  }

  // TODO: check that the school code is valid school code

  const token = encode({ id: student._id, code, _userType: student._userType });

  return { token, user: student };
}

async function studentChangePassword(req) {
  const { id } = req;
  const { oldPassword, newPassword } = req.body;

  const student = await Student.findById(id);
  if (!student) {
    throw new AccountError("invalid_credentials", "No user found");
  }

  const comparePassword = bcrypt.compareSync(oldPassword, student.password);
  if (!comparePassword) {
    throw new AccountError("invalid_credentials", "Incorrect password");
  }

  student.password = bcrypt.hashSync(newPassword, 10);
  return student.save();
}

async function getUserRole(req) {
  const { token } = req.body;
  if (!token) {
    throw new BadRequestError("Token is required");
  }

  const { _userType, ...rest } = decode(token);

  return {
    _userType,
  };
}

module.exports = {
  adminLogin,
  teacherLogin,
  studentLogin,
  adminChangePassword,
  teacherChangePassword,
  studentChangePassword,
  getUserRole,
};
