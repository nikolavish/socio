const db = require("../database");
const uploads = require("../utils/uploads");
const fs = require("fs");
const path = require("path");

module.exports = {
  async getProfilePicture(req, res) {
    let slug = req.query.slug.trim().toLowerCase();

    let user = await db.user.findOne({ where: { slug } });

    let imageFile = false;
    let fileName = "default.jpg";
    if (user) {
      if (!user.profilePicture) {
        imageFile = fs.readFileSync(
          path.join(__dirname, "..", "public", "profile-picture", "default.jpg")
        );
      } else {
        imageFile = await uploads.readFile(
          "user",
          `profile-picture/${user.id}.png`
        );
        fileName = `${user.id}.png`;
      }
    }
    try {
      if (imageFile) {
        res.setHeader(
          "Content-Disposition",
          "inline; filename=" + slug + ".png"
        );

        res.setHeader("Content-Type", `image/${fileName.split(".").pop()}`);

        return res.end(imageFile);
      }
    } catch (_) {
      console.log(_);
    }
    return res.sendStatus(404);
  },
  async getCoverPicture(req, res) {
    let slug = req.query.slug.trim().toLowerCase();

    let user = await db.user.findOne({ where: { slug } });

    let imageFile = false;
    let fileName = "default.jpg";
    if (user) {
      if (!user.coverPicture) {
        imageFile = fs.readFileSync(
          path.join(__dirname, "..", "public", "cover-picture", "default.jpg")
        );
      } else {
        imageFile = await uploads.readFile(
          "user",
          `cover-picture/${user.id}.png`
        );
        fileName = `${user.id}.png`;
      }
    }
    try {
      if (imageFile) {
        res.setHeader(
          "Content-Disposition",
          "inline; filename=" + slug + "." + fileName.split(".").pop()
        );

        res.setHeader("Content-Type", `image/${fileName.split(".").pop()}`);

        return res.end(imageFile);
      }
    } catch (_) {
      console.log(_);
    }
    return res.sendStatus(404);
  },
};
