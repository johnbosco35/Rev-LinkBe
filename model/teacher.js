const mongoose = require("mongoose");
const { User, validate: validateUser } = require("./user");

const TeacherSchema = new mongoose.Schema(
  {},
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const validate = (teacher) => {
  return validateUser(teacher);
};

TeacherSchema.virtual("allocations", {
  ref: "SubjectAllocation",
  localField: "_id",
  foreignField: "teacher",
  justOne: false,
});

const Teacher = User.discriminator("teacher", TeacherSchema);

module.exports = { Teacher, validate };
