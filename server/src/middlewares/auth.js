const auth = require("../utils/auth");
const response = require("../utils/response");

module.exports = async (req, res, next) => {
  let user = await auth.decodeToken(req.headers.authorization);

  res.locals.user = user;
  if (user) return next();

  return response.error(res, { message: "auth.unauthorized" });
};
