const Joi = require("joi");

module.exports = {
  create: Joi.object({
    content: Joi.string().optional().allow("").max(3000),
    media: Joi.array(),
  }),
  edit: Joi.object({}),
  archive: Joi.object({}),
  delete: Joi.object({}),
  createComment: Joi.object({
    content: Joi.string().max(300).required(),
    post: Joi.string().required(),
  }),
  editComment: Joi.object({}),
  deleteComment: Joi.object({}),
  replyComment: Joi.object({}),
  getComments: Joi.object({}),
  react: Joi.object({
    post: Joi.string().required(),
    reactionId: Joi.number().positive().required(),
  }),
  deleteReaction: Joi.object({
    post: Joi.string().required(),
  }),
};
