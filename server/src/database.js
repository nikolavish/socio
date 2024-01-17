const { Sequelize } = require("sequelize");
const env = require("./utils/env");
const user = require("./models/user");
const userFollower = require("./models/userFollower");
const post = require("./models/post");
const postMedia = require("./models/postMedia");
const reaction = require("./models/reaction");
const postComment = require("./models/postComment");
const reactionType = require("./models/reactionType");
const userRecovery = require("./models/userRecovery");
const PostView = require("./models/PostView");

const db = {};

db.connection = new Sequelize({
  host: env.get("DB_HOST", "localhost"),
  port: env.get("DB_PORT", 3306),
  database: env.get("DB_DATABASE"),
  username: env.get("DB_USERNAME", "root"),
  password: env.get("DB_PASSWORD", ""),
  dialect: "mysql",
});

db.user = user(db.connection);
db.userFollower = userFollower(db.connection);
db.post = post(db.connection);
db.postComment = postComment(db.connection);
db.postView = PostView(db.connection);
db.postMedia = postMedia(db.connection);
db.reactionType = reactionType(db.connection);
db.reaction = reaction(db.connection);
db.userRecovery = userRecovery(db.connection);

db.userFollower.belongsTo(db.user, {
  foreignKey: "followedById",
  as: "follower",
});
db.userFollower.belongsTo(db.user, { foreignKey: "followsId", as: "followed" });
db.user.hasMany(db.userFollower, {
  foreignKey: "followedById",
  as: "following",
});
db.user.hasMany(db.userFollower, { foreignKey: "followsId", as: "followers" });

db.post.belongsTo(db.user);
db.user.hasMany(db.post);

db.postMedia.belongsTo(db.post);
db.post.hasMany(db.postMedia);

db.reaction.belongsTo(db.reactionType);
db.reactionType.hasMany(db.reaction);

db.reaction.belongsTo(db.post);
db.reaction.belongsTo(db.user);
db.post.hasMany(db.reaction);
db.user.hasMany(db.reaction);

db.postComment.belongsTo(db.post);
db.postComment.belongsTo(db.postComment, {
  foreignKey: "replyToId",
  as: "replyTo",
});
db.postComment.hasMany(db.postComment, {
  foreignKey: "replyToId",
  as: "replies",
});

db.reaction.belongsTo(db.postComment);
db.postComment.hasMany(db.reaction);

db.userRecovery.belongsTo(db.user);
db.user.hasMany(db.userRecovery);

db.postView.belongsTo(db.post);
db.post.hasMany(db.postView);
db.postView.belongsTo(db.user);
db.user.hasMany(db.postView);

// db.connection.sync({force:true});

module.exports = db;
