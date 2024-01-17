const { Op } = require("sequelize");
const db = require("../database");
const auth = require("../utils/auth");
const response = require("../utils/response");
const env = require("../utils/env");

module.exports = {
  async login(req, res) {
    let { username: credential, password } = req.body;

    let user = await db.user.findOne({
      where: {
        [Op.or]: [{ username: credential }, { email: credential }],
      },
    });

    if (user && auth.verifyPassword(password, user.password)) {
      let token = auth.generateJWT(user);

      return response.success(res, {
        token,
        user: await auth.getUserData(user.id),
      });
    }
    return response.error(res, { message: "auth.error.check-credentials" });
  },
  async register(req, res) {
    let { displayName, email, username, password } = req.body;

    if (await auth.emailTaken(email))
      return response.error(res, { message: "auth.error.email-taken" });

    if (await auth.usernameTaken(username))
      return response.error(res, { message: "auth.error.username-taken" });

    let newUser = await db.user.create({
      username,
      password: auth.hashPassword(password),
      email,
      displayName,
    });

    if (newUser) {
      auth.sendWelcomeEmail(newUser);
      let token = auth.generateJWT(newUser);

      return response.success(res, {
        token,
        user: await auth.getUserData(newUser.id),
      });
    }
    return response.error(res, { message: "server.internal-error" });
  },
  async recovery(req, res) {
    let { email } = req.body;

    let existingUser = await db.user.findOne({ where: { email } });

    if (existingUser) {
      let token = await auth.generateRecoveryToken(existingUser, req);
      if (token) {
        return response.success(res, { token });
      }
      return response.error(res, { message: "server.internal-error" });
    }
    return response.error(res, { message: "auth.recovery.invalid-email" });
  },
  async changePassword(req, res) {
    let { code, email, password } = req.body;

    let tokenLimit = new Date();
    tokenLimit.setTime(tokenLimit.getTime() - 900000);

    let recoveryToken = await db.userRecovery.findOne({
      where: {
        code,
        verifiedAt: null,
        createdAt: {
          [Op.gte]: tokenLimit,
        },
      },
      include: { model: db.user, where: { email }, required: true },
    });

    if (recoveryToken) {
      recoveryToken.verifiedAt = new Date();
      await recoveryToken.save();

      let user = await db.user.findByPk(recoveryToken.userId);
      user.password = auth.hashPassword(password);
      if (await user.save()) {
        return response.success(res);
      }
      return response.error(res, { message: "server.internal-error" });
    }
    return response.error(res, { message: "auth.recovery.expired-token" });
  },
  async validateToken(req, res) {
    let token = await auth.decodeToken(req.headers.authorization);

    if (token) {
      let user = await auth.getUserData(token.id);
      if (user) {
        return response.success(res, { user });
      }
    }
    return response.error(res, { message: "Unauthorized!" });
  },
};
