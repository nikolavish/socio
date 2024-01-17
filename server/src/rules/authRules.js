const Joi = require("joi");

module.exports = {
  login: Joi.object({
    username: Joi.string().required().lowercase(),
    password: Joi.string().required(),
  }),
  register: Joi.object({
    username: Joi.string()
      .required()
      .min(1)
      .max(30)
      .regex(
        /^(?!.*[._]{2,})(?!^[._])(?!^[0-9])(?!.*[._]$)[a-zA-Z0-9._]{1,30}$/
      )
      .trim()
      .lowercase(),
    password: Joi.string().min(8).max(30),
    email: Joi.string().required().email(),
    displayName: Joi.string().max(30).optional().allow(""),
  }).unknown(),
  passwordRecovery: Joi.object({
    email: Joi.string().required(),
  }),
  changePassword: Joi.object({
    code: Joi.string().required(),
    password: Joi.string().min(8).max(30),
  }),
};
