const mongoose = require("mongoose");
const { User } = require("./user");
const Joi = require("joi");

const AdminSchema = new mongoose.Schema({
  privileges: {
    type: Map,
    of: [String],
  },
});

const Admin = User.discriminator("admin", AdminSchema);

const validateAdminLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    code: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = { Admin, validateAdminLogin };
