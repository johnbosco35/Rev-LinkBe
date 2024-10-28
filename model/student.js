const mongoose = require("mongoose");
const { User, validate: validateUser } = require("./user");

const StudentSchema = new mongoose.Schema({
  admissionNo: String,
  enrollmentDate: Date,
});

const validate = (student) => {
  return validateUser(student);
};

const Student = User.discriminator("student", StudentSchema);

module.exports = { Student, validate };
