const mongoose = require("mongoose");
const http = require("http");
const express = require("express");
const io = require("socket.io");
const setRoutes = require("./routes");
const setSocketHandlers = require("./sockets");

mongoose
  .connect("mongodb://localhost/chat", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    const app = express();

    setRoutes(app);

    const httpServer = http.createServer(app);

    const webSocketsServer = io(httpServer);

    webSocketsServer.on("connection", (socket) => {
      setSocketHandlers(socket);
    });

    httpServer.listen(3000, () => {
      console.log("Server listening on *:3000");
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
