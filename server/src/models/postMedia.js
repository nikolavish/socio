const { Sequelize, DataTypes } = require("sequelize");
const uuid = require("uuid");

/**
 *
 * @param {Sequelize} sequelize The active connection
 */
module.exports = (sequelize) => {
  return sequelize.define(
    "post_media",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      isVideo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isVideo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isDocument: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      url: {
        type: DataTypes.STRING,
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
