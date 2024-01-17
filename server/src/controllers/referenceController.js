const db = require("../database");
const response = require("../utils/response");

module.exports = {
  async getReactionArray(req, res) {
    let reactions = await db.reactionType.findAll({
      attributes: ["name", "icon", "id"],
    });

    return response.success(res, { reactions });
  },
};
