const { Sequelize, DataTypes } = require("sequelize");
const uuid = require("uuid");

/**
 *
 * @param {Sequelize} sequelize The active connection
 */
module.exports = (sequelize) => {
  return sequelize.define(
    "posts",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      content: {
        type: DataTypes.STRING(3000),
      },
      archivedOn: {
        type: DataTypes.DATE,
      },
      reactionCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      commentCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      shareCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      slug: {
        type: DataTypes.UUID,
        defaultValue() {
          return uuid.v4();
        },
      },
    },
    { paranoid: true }
  );
};
