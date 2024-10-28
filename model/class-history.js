const mongoose = require("mongoose");
const Joi = require("joi");
const mongoosePaginate = require("mongoose-paginate-v2");

const ClassHistorySchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    term: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Term",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const validate = (classHistory) => {
  const schema = Joi.object({
    class: Joi.string().required(),
    students: Joi.array().items(Joi.string()).min(1).required(),
    subject: Joi.string().required(),
    session: Joi.string().required(),
    term: Joi.string().required(),
  });

  return schema.validate(classHistory);
};

ClassHistorySchema.plugin(mongoosePaginate);

const ClassHistory = mongoose.model("ClassHistory", ClassHistorySchema);
module.exports = { ClassHistory, validate };
