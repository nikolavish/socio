const express = require("express");
const authController = require("./controllers/authController");
const postController = require("./controllers/postController");
const userController = require("./controllers/userController");
const validate = require("./utils/validate");
const authRules = require("./rules/authRules");
const postRules = require("./rules/postRules");
const userRules = require("./rules/userRules");
const auth = require("./middlewares/auth");
const searchController = require("./controllers/searchController");
const referenceController = require("./controllers/referenceController");
const storageController = require("./controllers/storageController");

const router = express.Router();

router.post("/login", validate(authRules.login), authController.login);
router.post("/register", validate(authRules.register), authController.register);
router.post("/password-recovery",validate(authRules.passwordRecovery),authController.recovery);
router.post("/change-password",validate(authRules.changePassword),authController.changePassword);
router.post("/validate-token", authController.validateToken);

router.get("/user/:username/");

router.put("/post/create",auth,validate(postRules.create),postController.create);
router.post("/post/edit", validate(postRules.edit), postController.edit);
router.post("/post/archive",validate(postRules.archive),postController.archive);
router.delete("/post/delete",validate(postRules.delete),postController.delete);

router.post("/post/comment/create",auth,validate(postRules.createComment),postController.createComment);
router.post("/post/comment/edit", auth, validate(postRules.editComment),postController.editComment);
router.delete("/post/comment/delete", auth, validate(postRules.deleteComment),postController.deleteComment);
router.post("/post/comment/reply", auth, validate(postRules.replyComment),postController.replyComment);
router.get("/post/comments", auth, validate(postRules.getComments),postController.getComments);

router.post("/post/react", auth, validate(postRules.react), postController.react);
router.delete("/post/delete-reaction", auth,validate(postRules.deleteReaction),postController.deleteReaction);

router.post("/user/follow", auth, userController.follow);
router.post("/user/unfollow", auth, userController.unfollow);
router.post("/user/block", userController.block);
router.get("/user/search", userController.search);
router.get("/user/get",auth, userController.get);
router.post("/user/update", auth, validate(userRules.update), userController.update);
router.post("/user/change-cover", auth, validate(userRules.changeCover), userController.changeCover);
router.post("/user/change-profile-picture", auth, validate(userRules.changeProfilePicture), userController.changeProfilePicture);
router.get("/user/profile-picture", storageController.getProfilePicture);
router.get("/user/cover-picture", storageController.getCoverPicture);

router.get("/search", auth, searchController.search);
router.get("/feed",auth,postController.getFeed);

router.get("/reference/reactions",auth,referenceController.getReactionArray);

module.exports = router;
