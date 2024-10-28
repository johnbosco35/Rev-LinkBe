const mongoose = require("mongoose");
const Joi = require("joi");
const mongoosePaginate = require("mongoose-paginate-v2");

const LessonStatus = {
  DRAFT: "draft",
  APPROVED: "approved",
  REJECTED: "rejected",
};

const LessonNoteSchema = new mongoose.Schema(
  {
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
    topic: {
      type: String,
      default: "enabled",
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: String,
    term: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Term",
    },
    week: String,
    attachments: [
      {
        type: Map,
        of: String,
      },
    ],
    videoUrl: {
      type: Map,
      of: String,
      nullable: true,
    },
    status: {
      type: String,
      enum: Object.values(LessonStatus),
      default: LessonStatus.DRAFT,
    },
  },
  { toJSON: { virtuals: true }, timestamps: true, virtuals: true }
);

LessonNoteSchema.virtual("assignments", {
  ref: "Assignment",
  localField: "_id",
  foreignField: "lessonNote",
  justOne: true,
});

LessonNoteSchema.virtual("announcements", {
  ref: "Announcement",
  localField: "_id",
  foreignField: "lessonNote",
  justOne: false,
});

const validate = (lessonNote) => {
  const schema = Joi.object({
    subject: Joi.string().required(),
    class: Joi.string().required(),
    topic: Joi.string().required(),
    content: Joi.string().required(),
    term: Joi.string().required(),
    week: Joi.string().required(),
    teacher: Joi.string().optional(),
  });

  return schema.validate(lessonNote);
};

LessonNoteSchema.plugin(mongoosePaginate);

const LessonNote = mongoose.model("LessonNote", LessonNoteSchema);

module.exports = { LessonNote, validate, LessonStatus };
