const db = require("../database");
const response = require("../utils/response");
const uploads = require("../utils/uploads");
const feed = require("../utils/feed");

module.exports = {
  async create(req, res) {
    let { content } = req.body;
    let files = req.files.filter((f) => f.fieldname == "media");

    if (!content && !files.length)
      return response.error(res, { message: "post.invalid-data" });

    res.locals.user.postCount++;
    await res.locals.user.save();

    let post = await db.post.create({ content, userId: res.locals.user.id });

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let fileType = uploads.getFileType(file);

      let upload = await db.postMedia.create({
        isVideo: fileType == "video",
        isDocument: fileType == "document",
        postId: post.id,
      });
      let fileName = `${post.slug}/${upload.slug}.${uploads.getExt(file)}`;
      upload.url = "/post/" + fileName;
      await upload.save();

      await uploads.saveUpload("post", fileName, file);
    }

    return response.success(res, {
      post: await feed.getPost({ slug: post.slug }),
    });
  },
  async edit(req, res) {},
  async archive(req, res) {},
  async delete(req, res) {},
  async createComment(req, res) {
    let { post, content } = req.body;

    let targetPost = await db.post.findOne({ where: { slug: post } });

    if (targetPost) {
      let comment = await db.postComment.create({
        postId: targetPost.id,
        content: content,
      });

      if (comment) {
        targetPost.commentCount++;
        await targetPost.save();
        return response.success(res);
      }
    }
    return response.error(res, { message: "server.internal-error" });
  },
  async editComment(req, res) {},
  async deleteComment(req, res) {},
  async replyComment(req, res) {},
  async getComments(req, res) {},
  async react(req, res) {
    let { post: postSlug, reactionId } = req.body;

    let post = await db.post.findOne({ where: { slug: postSlug } });

    let reaction = await db.reactionType.findByPk(reactionId);

    if (post && reaction) {
      let currentReaction = await db.reaction.findOne({
        where: { postId: post.id, userId: res.locals.user.id },
      });

      if (!currentReaction) {
        let reaction = await db.reaction.create({
          userId: res.locals.user.id,
          postId: post.id,
          reactionTypeId: reactionId,
        });
        post.reactionCount++;
        await post.save();
      } else {
        currentReaction.reactionTypeId = reactionId;
        await currentReaction.save();
      }
      return response.success(res);
    }
    return response.error(res, { message: "server.internal-error" });
  },
  async deleteReaction(req, res) {
    let { post: postSlug } = req.body;
    let post = await db.post.findOne({ where: { slug: postSlug } });
    if (post) {
      let reactionRemoved = await db.reaction.destroy({
        where: {
          userId: res.locals.user.id,
          postId: post.id,
        },
      });

      if (reactionRemoved > 0) {
        post.reactionCount--;
        await post.save();
        return response.success(res);
      }
    }
    return response.error(res, { message: "server.internal-error" });
  },
  async getFeed(req, res) {
    let { username, page } = req.query;
    let posts = await feed.getFeed(res.locals.user, page, username);

    return response.success(res, { posts });
  },
};
