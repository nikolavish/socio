const { Sequelize, DataTypes } = require("sequelize");
const uuid = require("uuid");

/**
 *
 * @param {Sequelize} sequelize The active connection
 */
module.exports = (sequelize) => {
  return sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      profilePicture: {
        type: DataTypes.TEXT,
        defaultValue: `/profile-picture/default.png`,
      },
      coverPicture: {
        type: DataTypes.TEXT,
        defaultValue: `/cover-picture/default.jpg`,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      displayName: {
        type: DataTypes.STRING,
      },
      biography: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      verifiedAt: {
        type: DataTypes.DATE,
      },
      slug: {
        type: DataTypes.UUID,
        defaultValue() {
          return uuid.v4();
        },
      },
      followerCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      followingCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      postCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    { paranoid: true }
  );
};
