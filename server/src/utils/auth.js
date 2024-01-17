const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("./env");
const db = require("../database");
const mailer = require("./mailer");

module.exports = {
  verifyPassword: (password, hash) => bcrypt.compareSync(password, hash),
  hashPassword: (password) => bcrypt.hashSync(password, bcrypt.genSaltSync()),
  generateJWT: (user) => {
    let token = jwt.sign({ id: user.id }, env.get("AUTH_SECRET", "demosecret"));

    return token;
  },
  usernameTaken: (username) =>
    db.user.findOne({ where: { username: username } }),
  emailTaken: (email) => db.user.findOne({ where: { email: email } }),
  sendWelcomeEmail: (user) => {
    return mailer.send(user.email, {
      template: "auth/register",
      data: { name: user.displayName ?? user.username },
    });
  },
  generateRecoveryToken: async (user, req) => {
    await db.userRecovery.destroy({
      where: { userId: user.id, verifiedAt: null },
    });

    let token = await db.userRecovery.create({
      user,
      ip: req.ip,
      userAgent: req.headers["User-Agent"],
    });

    return token.token;
  },
  getUserData: async (userId) => {
    let user = await db.user.findByPk(userId, {
      attributes: [
        "profilePicture",
        "coverPicture",
        "username",
        "email",
        "displayName",
        "biography",
        "verifiedAt",
        "slug",
        "followerCount",
        "followingCount",
        "postCount",
      ],
    });
    
    return user;
  },
  decodeToken: (token) => {
    try {
      let decodedToken = jwt.verify(
        token,
        env.get("AUTH_SECRET", "demosecret")
      );

      
      return db.user.findOne({ where: { id: decodedToken.id } });
    } catch (_) {
      console.log(_);
      return false;
    }
  },
};
