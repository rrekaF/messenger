const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const sqlite3 = require("sqlite3").verbose();
<<<<<<< HEAD
async function main() {
  const db = new sqlite3.Database(":memory:", (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("connected to database");
    }
  })
=======

let db = new sqlite3.Database("./msg.db");
// db.run("CREATE TABLE messages(msgid integer primary key, content text, sender integer not null, foreign key (sender) references users (uid));");

// db.run(`INSERT INTO messages(content, sender) VALUES("Waltaah", 3);`, (err) => {
//   if (err) {
//     console.log("(-) Getting error: ", err);
//   }
// });

// db.all("SELECT content, users.name FROM messages JOIN users ON messages.sender = users.uid;", (err, rows) => {
//   if (err) {
//     console.log("(-) Getting error: " + err);
//   }
//   console.log(rows);
// });
let users = [];

async function dbGetUsers() {
  db.all(`SELECT uid, name FROM users`, function (err, rows) {
    if (err) {
      console.log("(-) Getting error querying users: " + err);
      return 1;
    }
    rows.forEach((element) => {
      users.push(element);
      console.log("appended : " + element);
    });
    // console.log(rows); // prints correct data
    return rows;
  });
}
>>>>>>> 7d25c03d75509ea62b13bc28edbdacebb05655ee

function dbAddMessage(message) {
  console.log("Inserting new message: " + message);

  db.run(`INSERT INTO messages(content, sender) VALUES("` + message.message + `", ` + message.name + `);`, (err) => {
    if (err) {
      console.log("(-) Getting error while inserting message: ", err);
    } else {
      console.log("(+) Successfully inserted message");
    }
  });
}

async function main() {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
  });
  await dbGetUsers();
  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });
  io.on("connection", (socket) => {
    console.log("User connected");
    socket.on("new message", (message) => {
<<<<<<< HEAD
=======
      dbAddMessage(message);

>>>>>>> 7d25c03d75509ea62b13bc28edbdacebb05655ee
      io.emit("new message", message);
    });
    socket.on("get users", () => {
      console.log(users); // Prints undefined
      io.emit("get users", users);
    });
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  server.listen(3000, () => {
    console.log("Server running on port 3000.");
  });
}
main();
