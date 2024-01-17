const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("./env");
const db = require("../database");
const mailer = require("./mailer");
const { Op, Sequelize } = require("sequelize");

const perPage = 10;

const postData = (user, targetUsername = false) => {
  let userWhere = {};
  if (targetUsername && targetUsername) {
    userWhere.username = targetUsername.trim().toLowerCase();
  }

  return {
    attributes: ["content", "slug", "createdAt","reactionCount","commentCount","shareCount"],
    include: [
      {
        model: db.user,
        attributes: ["username", "displayName", "profilePicture", "verifiedAt"],
        required: targetUsername,
        where: userWhere,
      },
      {
        model: db.postMedia,
        attributes: ["isVideo", "isDocument", "slug", "url"],
        required: false,
      },
      {
        model: db.postView,
        where: {
          userId: user?.id ?? null,
        },
        required: false,
      },
      {
        model: db.reaction,
        where: {
          userId: user?.id ?? null,
        },
        required: false,
      },
    ],
  };
};

module.exports = {
  getFeed: async (user, page, targetUser = false) => {
    let followingUsers = await db.userFollower.findAll({
      attributes: ["followsId"],
      where: {
        followedById: user.id,
      },
    });

    page = Math.max(1, page ?? 1);

    let wheres = {};

    let followIds = [];
    if (!targetUser) {
      followIds = followingUsers.map((follow) => follow.followsId);
      wheres.userId = { [Op.in]: followIds };
    } else {
      if (user.username != targetUser) {
        wheres.archivedOn = null;
      }
    }
    let posts = await db.post.findAll({
      where: wheres,
      order: [
        ["createdAt", "desc"],
        [{ model: db.postView }, "postId", "asc"],
      ],
      offset: perPage * (page - 1),
      limit: perPage,
      ...postData(user, targetUser),
    });

    posts = posts.map((post) => {
      post.dataValues.reactionType =
        post.dataValues.reactions[0]?.reactionTypeId;
      delete post.dataValues.reactions;

      return post;
    });

    return posts;
  },
  async getPost({ slug = null, id = null }) {
    let wheres = {
      archivedOn: null,
    };
    if (slug) {
      wheres.slug = slug;
    }
    if (id) {
      wheres.id = id;
    }

    let post = await db.post.findOne({
      where: wheres,
      ...postData(null),
    });

    post.dataValues.reactionType = post.dataValues.reactions[0]?.reactionTypeId;
    delete post.dataValues.reactions;

    return post;
  },
};
