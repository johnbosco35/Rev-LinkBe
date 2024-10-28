const mongoose = require("mongoose");
const Joi = require("joi");

const ClassLevelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    coreApiId: String,
  },
  { timestamps: true, versionKey: false }
);

const validate = (classLevel) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  return schema.validate(classLevel);
};

const ClassLevel = mongoose.model("ClassLevel", ClassLevelSchema);
module.exports = { ClassLevel, validate };
