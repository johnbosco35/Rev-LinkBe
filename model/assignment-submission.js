const mongoose = require("mongoose");
const Joi = require("joi");
const mongoosePaginate = require("mongoose-paginate-v2");

const AssignmentSubmissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    content: String,
    attachments: [
      {
        type: Map,
        of: String,
      },
    ],
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    grade: {
      type: Number,
    },
  },
  { timestamps: true, versionKey: false }
);

const validate = (assignmentSubmission) => {
  const schema = Joi.object({
    content: Joi.string().optional(),
  });

  return schema.validate(assignmentSubmission);
};

const validateGrade = (grade) => {
  const schema = Joi.object({
    grade: Joi.number().min(0).max(100).required(),
    submissions: Joi.array().items(Joi.string()).optional(),
  });

  return schema.validate(grade);
};

AssignmentSubmissionSchema.plugin(mongoosePaginate);

const AssignmentSubmission = mongoose.model(
  "AssignmentSubmission",
  AssignmentSubmissionSchema
);
module.exports = { AssignmentSubmission, validate, validateGrade };
