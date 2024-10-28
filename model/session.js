const mongoose = require("mongoose");
const Joi = require("joi");

const SessionSchema = new mongoose.Schema(
  {
    name: String,
    startDate: Date,
    endDate: Date,
    coreApiId: String,
  },
  { timestamps: true, versionKey: false }
);

const validate = (session) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
  });

  return schema.validate(session);
};

const Session = mongoose.model("Session", SessionSchema);
module.exports = { Session, validate };
