const Joi = require("joi");
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const SubjectAllocationSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    coreApiId: String,
  },
  { timestamps: true, versionKey: false }
);

const validate = (data) => {
  const schema = Joi.object({
    subject: Joi.string().required(),
    teacher: Joi.string().required(),
    class: Joi.string().required(),
  });

  return schema.validate(data);
};

SubjectAllocationSchema.plugin(mongoosePaginate);

const SubjectAllocation = mongoose.model(
  "SubjectAllocation",
  SubjectAllocationSchema
);
module.exports = { SubjectAllocation, validate };
