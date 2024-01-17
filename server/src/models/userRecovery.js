const { Sequelize, DataTypes } = require("sequelize");

/**
 *
 * @param {Sequelize} sequelize The active connection
 */
module.exports = (sequelize) => {
  return sequelize.define(
    "user_recovery",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userAgent: {
        type: DataTypes.TEXT,
      },
      ipAddress: {
        type: DataTypes.TEXT,
      },
      verifiedAt: {
        type: DataTypes.DATE,
      },
      code: {
        type: DataTypes.INTEGER({ length: 6 }),
        defaultValue() {
          let token = Math.floor(Math.random() * (999999 - 100000)) + 100000;

          return token;
        },
      },
    },
    { paranoid: true }
  );
};
