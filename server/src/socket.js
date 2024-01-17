const io = require("socket.io");

module.exports = {
  start(server) {
    const socket = io(server);

    socket.on("connection", (client) => {});
  },
};
