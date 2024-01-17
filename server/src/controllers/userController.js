const fs = require("fs");
const path = require("path");
const db = require("../database");
const response = require("../utils/response");
const uploads = require("../utils/uploads");
const auth = require("../utils/auth");

module.exports = {
  async follow(req, res) {
    let { username } = req.body;
    username = username.trim().toLowerCase();

    let isFollowing = await db.userFollower.findOne({
      include: [
        {
          model: db.user,
          as: "followed",
          where: { username },
          required: true,
        },
      ],
      where: { followedById: res.locals.user.id },
    });

    if (!isFollowing) {
      let followedUser = await db.user.findOne({ where: { username } });

      let follow = await db.userFollower.create({
        followsId: followedUser.id,
        followedById: res.locals.user.id,
      });

      if (follow) {
        followedUser.followerCount++;
        await followedUser.save();
        res.locals.user.followingCount++;
        await res.locals.user.save();
        return response.success(res);
      }
    }
    return response.error(res, { message: "server.internal-error" });
  },
  async unfollow(req, res) {
    let { username } = req.body;
    username = username.trim().toLowerCase();

    let isFollowing = await db.userFollower.findOne({
      include: [
        {
          model: db.user,
          as: "followed",
          where: { username },
          required: true,
        },
      ],
      where: { followedById: res.locals.user.id },
    });

    if (isFollowing) {
      let followedUser = await db.user.findOne({ where: { username } });

      let unfollow = await db.userFollower.destroy({
        where: {
          followsId: followedUser.id,
          followedById: res.locals.user.id,
        },
      });

      if (unfollow) {
        followedUser.followerCount--;
        await followedUser.save();
        res.locals.user.followingCount--;
        await res.locals.user.save();
        return response.success(res);
      }
    }
    return response.error(res, { message: "server.internal-error" });
  },
  async block(req, res) {},
  async search(req, res) {},
  async get(req, res) {
    let username = req.query.username.trim().toLowerCase();

    let user = await db.user.findOne({ where: { username } });

    if (user) {
      let userData = await auth.getUserData(user.id);

      let isFollowing = await db.userFollower.findOne({
        where: { followedById: res.locals.user.id, followsId: user.id },
      });

      userData.dataValues.isFollowing = !!isFollowing;

      console.log(userData);

      return response.success(res, { user: userData });
    }

    return response.error(res, { message: "server.internal-error" });
  },
  async changeCover(req, res) {
    let image = req.files[0];

    if (await uploads.saveCoverPicture(image, res.locals.user.id)) {
      res.locals.user.coverPicture =
        "/user/cover-picture?slug=" + res.locals.user.slug;
      await res.locals.user.save();
      console.log(res.locals.user);

      return response.success(res, {
        coverPicture: res.locals.user.coverPicture,
      });
    }
    return response.error(res, { message: "server.internal-error" });
  },
  async changeProfilePicture(req, res) {
    let image = req.files[0];

    if (await uploads.saveProfilePicture(image, res.locals.user.id)) {
      res.locals.user.profilePicture =
        "/user/profile-picture?slug=" + res.locals.user.slug;
      await res.locals.user.save();

      return response.success(res, {
        profilePicture: res.locals.user.profilePicture,
      });
    }
    return response.error(res, { message: "server.internal-error" });
  },
  async update(req, res) {
    let body = req.body;

    if (body.username !== undefined) {
      let userByUsername = await db.user.findOne({
        where: { username: body.username },
      });

      if (userByUsername) {
        return response.error(res, { message: "Username already in use!" });
      }

      res.locals.user.username = body.username;
    }
    if (body.displayName !== undefined) {
      res.locals.user.displayName = body.displayName;
    }
    if (body.biography !== undefined) {
      res.locals.user.biography = body.biography;
    }

    if (await res.locals.user.save()) {
      return response.success(res);
    }

    return response.error(res, { message: "server.internal-error" });
  },
};
