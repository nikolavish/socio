const bodyParser = require("body-parser");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const routes = require("./routes");

module.exports = {
  start() {
    let app = express();
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(multer({ limits: { fileSize: 5242880 } }).any());
    app.use(express.static(path.join(__dirname, "public")));

    app.use(routes);

    return app;
  },
};
