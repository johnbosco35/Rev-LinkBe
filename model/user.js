const mongoose = require("mongoose");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const mongoosePaginate = require("mongoose-paginate-v2");

const schemaOptions = {
  discriminatorKey: "_userType",
  collection: "users",
  versionKey: false,
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
};

const UserSchema = new mongoose.Schema(
  {
    title: String,
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    othernames: String,
    email: {
      type: String,
      lowercase: true,
    },
    phoneNumber: String,
    password: { type: String },
    gender: {
      type: String,
      lowercase: true,
    },
    photo: String,
    coreApiId: String,
  },
  schemaOptions
);

const validate = (user) => {
  const schema = Joi.object({
    title: Joi.string().optional(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    othernames: Joi.string().allow(""),
    email: Joi.string().email().required(),
    gender: Joi.string(),
    password: passwordComplexity().required(),
    phoneNumber: Joi.string().allow(""),
  });

  return schema.validate(user);
};

const validateAddPrivilege = (admin) => {
  const schema = Joi.object({
    privileges: Joi.object().required(),
  });

  return schema.validate(admin);
};

const validateChangePassword = (user) => {
  const schema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  });

  return schema.validate(user);
};

UserSchema.index({ _userType: 1, email: 1 }, { unique: true });

UserSchema.plugin(mongoosePaginate);

const User = mongoose.model("User", UserSchema);

module.exports = {
  User,
  validate,
  validateAddPrivilege,
  validateChangePassword,
};
