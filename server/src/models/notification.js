const { Sequelize, DataTypes } = require("sequelize");

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
