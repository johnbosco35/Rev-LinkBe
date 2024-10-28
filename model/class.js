const mongoose = require("mongoose");
const Joi = require("joi");
const mongoosePaginate = require("mongoose-paginate-v2");

const ClassSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassLevel",
    },
    coreApiId: String,
  },
  { timestamps: true, versionKey: false }
);

const validate = (c) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    level: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  });

  return schema.validate(c);
};

ClassSchema.plugin(mongoosePaginate);

const Class = mongoose.model("Class", ClassSchema);
module.exports = { Class, validate };
