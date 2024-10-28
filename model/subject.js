const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Joi = require("joi");

const SUBJECT_TYPE = {
  COMPULSORY: "compulsory",
  ELECTIVE: "elective",
};

const SubjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    status: { type: String, default: "enabled" },
    abbreviation: String,
    type: { type: String, enum: Object.values(SUBJECT_TYPE) },
    thumbnail: String,
    coreApiId: String,
  },
  { timestamps: true, versionKey: false }
);

const validate = (subject) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    abbreviation: Joi.string().required(),
    type: Joi.string().allow(...Object.values(SUBJECT_TYPE)),
  });

  return schema.validate(subject);
};

SubjectSchema.plugin(mongoosePaginate);

const Subject = mongoose.model("Subject", SubjectSchema);
module.exports = { Subject, validate };
