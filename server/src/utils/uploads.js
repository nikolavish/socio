const fs = require("fs");
const path = require("path");
const jimp = require("jimp");
const supportedFormats = {
  video: ["mp4"],
  image: ["jpg", "jpeg", "png", "gif", "svg"],
};

const getExt = (file) =>
  file.originalname.split(".").pop().trim().toLowerCase();
const baseDir = path.join(__dirname, "..", "storage");
module.exports = {
  getFileType: (file) => {
    let extension = getExt(file);
    return (
      Object.keys(supportedFormats).filter((key) =>
        supportedFormats[key].includes(extension)
      ) ?? false
    );
  },
  getExt: getExt,
  saveUpload: (bucket, destination, file) => {
    return new Promise((res, rej) => {
      let realDestination = path.join(baseDir, bucket, destination);
      fs.mkdirSync(path.join(realDestination, ".."), { recursive: true });
      fs.writeFileSync(realDestination, file.buffer);

      if (supportedFormats.image.includes(getExt(file))) {
        jimp.read(realDestination, (err, img) => {
          img.quality(60).cover(1280, 1280).write(realDestination);
          res();
        });
      } else {
        res();
      }
    });
  },
  saveCoverPicture: (image, id) => {
    return new Promise((res, rej) => {
      let fileName = id + ".png";
      let realDestination = path.join(
        baseDir,
        "user",
        "cover-picture",
        fileName
      );

      fs.mkdirSync(path.join(realDestination, ".."), { recursive: true });
      fs.writeFileSync(realDestination, image.buffer);

      jimp.read(realDestination, (err, img) => {
        img.quality(60).cover(1280, 1280).write(realDestination);
        let targetHeight = img.getWidth() / 3;
        img
          .crop(
            0,
            (img.getHeight() - targetHeight) / 2,
            img.getWidth(),
            targetHeight
          )
          .write(realDestination);
        res(true);
      });
    });
  },
  saveProfilePicture: (image, id) => {
    return new Promise((res, rej) => {
      let fileName = id + ".png";
      let realDestination = path.join(
        baseDir,
        "user",
        "profile-picture",
        fileName
      );

      fs.mkdirSync(path.join(realDestination, ".."), { recursive: true });
      fs.writeFileSync(realDestination, image.buffer);

      jimp.read(realDestination, (err, img) => {
        img.quality(60).cover(720, 720).write(realDestination);
        let targetDimension = Math.min(img.getWidth(), img.getHeight());
        img
          .crop(
            (img.getWidth() - targetDimension) / 2,
            (img.getHeight() - targetDimension) / 2,
            targetDimension,
            targetDimension
          )
          .write(realDestination);
        res(true);
      });
    });
  },
  readFile: async (bucket, filename) => {
    let fileName = path.join(baseDir, bucket, filename);

    return fs.readFileSync(fileName);
  },
};
