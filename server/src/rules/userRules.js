const Joi = require("joi");

module.exports = {
  changeCover: Joi.object({}),
  changeProfilePicture: Joi.object({}),
  update: Joi.object({
    displayName: Joi.string().max(30).optional(),
    username: Joi.string()
      .optional()
      .min(1)
      .max(30)
      .regex(
        /^(?!.*[._]{2,})(?!^[._])(?!^[0-9])(?!.*[._]$)[a-zA-Z0-9._]{1,30}$/
      ).trim().lowercase(),
    biography: Joi.string().max(300).optional().allow(""),
  }),
};
