const mongoose = require("mongoose");
const Joi = require("joi");
const mongoosePaginate = require("mongoose-paginate-v2");

const AssignmentSchema = new mongoose.Schema(
  {
    content: String,
    title: String,
    lessonNote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LessonNote",
    },
    term: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Term",
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    attachments: [
      {
        type: Map,
        of: String,
      },
    ],
    dueDate: Date,
    canSubmitAfterDeadline: {
      type: Boolean,
      default: false,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    noOfGroups: {
      type: Number,
      default: 0,
    },
    addAutomatically: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false, toJSON: { virtuals: true } }
);

const validate = (assignment) => {
  const schema = Joi.object({
    title: Joi.string().optional(),
    content: Joi.string().required(),
    lessonNote: Joi.string().optional(),
    term: Joi.string().required(),
    subject: Joi.string().required(),
    class: Joi.string().required(),
    dueDate: Joi.date().required(),
    isGroup: Joi.boolean().optional().default(false),
    canSubmitAfterDeadline: Joi.boolean().optional().default(false),
    noOfGroups: Joi.number().optional().default(0),
    groups: Joi.array().items(
      Joi.object()
        .optional()
        .keys({
          name: Joi.string().required(),
          students: Joi.array().items(Joi.string()).required(),
        })
    ),
    addAutomatically: Joi.boolean().optional().default(false),
  });

  return schema.validate(assignment);
};

AssignmentSchema.virtual("groups", {
  ref: "AssignmentGroup",
  localField: "_id",
  foreignField: "assignment",
  justOne: false,
});

AssignmentSchema.virtual("submission", {
  ref: "AssignmentSubmission",
  localField: "_id",
  foreignField: "assignment",
  justOne: true,
});

AssignmentSchema.plugin(mongoosePaginate);

const Assignment = mongoose.model("Assignment", AssignmentSchema);
module.exports = { Assignment, validate };
