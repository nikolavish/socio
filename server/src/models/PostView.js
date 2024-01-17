const { Sequelize, DataTypes } = require("sequelize");

/**
 *
 * @param {Sequelize} sequelize The active connection
 */
module.exports = (sequelize) => {
  return sequelize.define("post_views", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
  });
};
