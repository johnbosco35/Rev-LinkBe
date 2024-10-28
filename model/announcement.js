const mongoose = require("mongoose");
const Joi = require("joi");
const mongoosePaginate = require("mongoose-paginate-v2");

const AnnouncementSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    lessonNote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LessonNote",
    },
    meta: { type: Map, of: String },
    attachments: [
      {
        type: Map,
        of: String,
      },
    ],
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
    dueDate: Date,
  },
  { timestamps: true, versionKey: false }
);

const validate = (announcement) => {
  const schema = Joi.object({
    title: Joi.string().optional(),
    content: Joi.string().required(),
    lessonNote: Joi.string().optional(),
    subject: Joi.string().required(),
    class: Joi.string().required(),
    meta: Joi.object().optional(),
    dueDate: Joi.date().optional(),
    addAutomatically: Joi.boolean().optional(),
  });

  return schema.validate(announcement);
};

AnnouncementSchema.plugin(mongoosePaginate);

const Announcement = mongoose.model("Announcement", AnnouncementSchema);
module.exports = { Announcement, validate };
