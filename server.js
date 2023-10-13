const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const { MongoClient } = require("mongodb");
async function main() {
  const pwd = encodeURIComponent("2Wr&p%S4");
  const uri = "mongodb+srv://patrykawojnarowski:" + pwd + "@message-app.ubyzplz.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri);
  const dbName = "message-app";
  const collectionName = "messages";

  const database = await client.db(dbName);
  console.log("connected to db");
  collection = database.collection(collectionName);
  console.log("connected to collection");

  async function insertMessage(message) {
    try {
      const insertResult = collection.insertOne(message).then(() => {
        console.log("inserted successfully");
      });
    } catch (err) {
      console.log(err);
    }
  }

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
      insertMessage(message);
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
