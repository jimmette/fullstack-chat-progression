const DB_NAME = "decode-chatbox";
const DB_COLLECTION_PWD = "passwords";
const DB_COLLECTION_msg = "messages";

let express = require("express");
let cors = require("cors");
let bodyParser = require("body-parser");
let app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(bodyParser.raw({ type: "*/*" }));

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://admin:Er123123@ds125385.mlab.com:25385/decode-chatbox";

let generatedId = function() {
  return "" + Math.floor(Math.random() * 10000000000000000);
};

let passwords = {};
let messages = [];
let sessions = {};

app.post("/newmessage", function(req, res) {
  console.log("/newmessage endpoint");
  let body = JSON.parse(req.body);
  let sessionId = req.headers.cookie;
  let newMsg = {
    username: sessions[sessionId],
    message: body.msg,
    color: body.color,
    time: new Date().toLocaleTimeString()
  };

  // MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
  //   if (err) throw err;
  //   let dbo = db.db(DB_NAME);
  //   dbo.collection(DB_COLLECTION_PWD).insertOne(review, (err, result) => {
  //     if (err) throw err;
  //     db.close();
  //     console.log("postReview success");
  //     res.send(JSON.stringify({ success: true }));
  //   });
  // });

  messages.unshift(newMsg);
  res.send(JSON.stringify({ success: true }));
});

app.get("/messages", function(req, res) {
  console.log("/messages endpoint");
  let sessionId = req.headers.cookie;
  if (sessions[sessionId] !== undefined) {
    let lastMessages = messages.slice(0, 20);
    res.send(JSON.stringify({ messages: lastMessages, success: true }));
  } else {
    res.send(JSON.stringify({ messages: [], success: false }));
  }
});

app.post("/logout", function(req, res) {
  console.log("/logout endpoint");
  let sessionId = req.headers.cookie;
  if (sessions[sessionId]) {
    let username = sessions[sessionId];
    delete sessions[sessionId];
    messages.unshift({
      username: username,
      message: " has logged out.",
      time: new Date().toLocaleTimeString()
    });
    res.send(JSON.stringify({ success: true }));
  } else {
    res.send(JSON.stringify({ success: false }));
  }
});

app.post("/doesuserexist", function(req, res) {
  console.log("/doesuserexist endpoint");
  let body = JSON.parse(req.body);
  let username = body.username;

  if (passwords[username] === undefined) {
    res.send(JSON.stringify({ success: false }));
  } else {
    res.send(JSON.stringify({ success: true }));
  }
});

app.post("/signup", function(req, res) {
  console.log("/signup endpoint");
  let body = JSON.parse(req.body);
  let username = body.username;
  let password = body.password;

  passwords[username] = password;

  res.send(JSON.stringify({ success: true }));
});

app.post("/login", function(req, res) {
  console.log("/login endpoint");
  let body = JSON.parse(req.body);
  let username = body.username;
  let password = body.password;

  if (passwords[username] === password) {
    id = generatedId();
    sessions[id] = username;
    res.set("Set-Cookie", "" + id);
    messages.unshift({
      username: username,
      message: " has logged in.",
      time: new Date().toLocaleTimeString()
    });
    res.send(JSON.stringify({ success: true, username: username }));
  } else {
    res.send(JSON.stringify({ success: false }));
  }
});

app.listen(4000);
