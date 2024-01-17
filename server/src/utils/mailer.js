const nodemailer = require("nodemailer");
const env = require("./env");
const pug = require("pug");
const path = require("path");

const templateDir = path.join(__dirname, "..", "mail");

module.exports = {
  send: (to, { template, data = {} }) => {
    return new Promise((res, rej) => {
      let transport = nodemailer.createTransport({
        host: env.get("SMTP_HOST"),
        port: env.get("SMTP_PORT"),
        secure: env.get("SMTP_SSL") == "true",
        auth: {
          user: env.get("SMTP_USER"),
          pass: env.get("SMTP_PASS"),
        },
      });

      transport.sendMail(
        {
          to,
          from: env.get("SMTP_FROM"),
          html: pug.renderFile(path.join(templateDir, template + ".pug"), {
            globals: [data],
            basedir: templateDir,
          }),
        },
        (err, info) => {
          if (err) rej(err);
          else res(info);
        }
      );
    });
  },
};
