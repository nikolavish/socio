module.exports = {
  get(key, defaultValue = null) {
    return process.env[key] ?? defaultValue;
  },
};
