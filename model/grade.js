const mongoose = require("mongoose");

const GradeSchema = new mongoose.Schema(
  {
    assignmentSubmission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssignmentSubmission",
      required: true,
    },
    grade: String,
    remark: String,
  },
  { timestamps: true, versionKey: false }
);

const Grade = mongoose.model("Grade", GradeSchema);
module.exports = Grade;
