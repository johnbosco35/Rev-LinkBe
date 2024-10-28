const mongoose = require("mongoose");
const Joi = require("joi");

const TermSchema = new mongoose.Schema(
  {
    term: Number,
    startDate: Date,
    endDate: Date,
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    coreApiId: String,
  },
  { timestamps: true, versionKey: false }
);

const validate = (term) => {
  const schema = Joi.object({
    term: Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    session: Joi.string().required(),
  });

  return schema.validate(term);
};

const Term = mongoose.model("Term", TermSchema);
module.exports = { Term, validate };
