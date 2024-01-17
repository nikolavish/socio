const response = require("./response");

module.exports = (rules) => (req, res, next) => {
  let result = rules.validate(req.body);

  if (result.error) {
    return response.error(res, { error: result.error });
  }

  req.body = result.value;
  return next();
};
