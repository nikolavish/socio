const { Op, Sequelize } = require("sequelize");
const db = require("../database");
const response = require("../utils/response");

module.exports = {
  async search(req, res) {
    let { q: keyword } = req.query;
    keyword = "%" + keyword.trim().toLowerCase() + "%";

    let users = await db.user.findAll({
      attributes: [
        "username",
        "displayName",
        "biography",
        "verifiedAt",
        "profilePicture",
        "coverPicture",
      ],
      where: {
        [Op.or]: [
          {
            username: {
              [Op.like]: keyword,
            },
          },
          {
            displayName: {
              [Op.like]: keyword,
            },
          },
          {
            biography: {
              [Op.like]: keyword,
            },
          },
        ],
        isActive: true,
      },
      include: [
        {
          model: db.userFollower,
          as: "followers",
          where: { followedById: res.locals.user.id },
          required: false,
        },
      ],
      order: [[Sequelize.literal("verifiedAt IS NULL"), "desc"]],
    });

    users = users.map((user) => {
      user.dataValues.isFollowing = !!user.dataValues.followers.length;
      delete user.dataValues.followers;
      return user;
    });

    return response.success(res, { users });
  },
};
