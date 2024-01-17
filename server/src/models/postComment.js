const { Sequelize, DataTypes } = require("sequelize");

/**
 *
 * @param {Sequelize} sequelize The active connection
 */
module.exports = (sequelize) => {
  return sequelize.define("post_comments", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING(300),
    },
  });
};
