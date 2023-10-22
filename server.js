const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const sqlite3 = require("sqlite3").verbose();
async function main() {
  const db = new sqlite3.Database(":memory:", (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("connected to database");
    }
  })

  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
  });

  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });

  io.on("connection", (socket) => {
    console.log("User connected");
    socket.on("new message", (message) => {
      io.emit("new message", message);
    });
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  server.listen(3000, () => {
    console.log("Server running on port 3000.");
  });
  await client.close();
}
main();
