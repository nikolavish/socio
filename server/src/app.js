require("dotenv").config();
const server = require("./server");
const http = require("http");
const env = require("./utils/env");
const socket = require("./socket");
const uploads = require("./utils/uploads");


const init = () => {
  let httpServer = http.createServer(server.start());

  socket.start(httpServer);

  let host = env.get("SERVER_HOST", "127.0.0.1");
  let port = env.get("SERVER_PORT", 3000);
  httpServer.listen(port, host, () => {
    console.log(
      `[ i ] - Server started successfully on http://${host}:${port}`
    );
  });
};

init();
