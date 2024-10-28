const mongoose = require("mongoose");
const Joi = require("joi");

const AssignmentGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

const AssignmentGroup = mongoose.model(
  "AssignmentGroup",
  AssignmentGroupSchema
);
module.exports = AssignmentGroup;
