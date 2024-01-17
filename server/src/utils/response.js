const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("./env");

module.exports = {
  success: (res, data = {}) => res.json({ success: true, data }),
  error: (res, data = {}) => res.json({ success: false, data }),
};
