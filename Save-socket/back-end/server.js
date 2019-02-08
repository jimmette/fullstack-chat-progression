const DB_NAME = "decode-chatbox";
const DB_COLLECTION_PWD = "passwords";
const DB_COLLECTION_MSG = "messages";

let express = require("express");
let cors = require("cors");
let bodyParser = require("body-parser");
let app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(bodyParser.raw({ type: "*/*" }));

let MongoClient = require("mongodb").MongoClient;
const url = "mongodb://admin:Er123123@ds125385.mlab.com:25385/decode-chatbox";

let http = require("http").Server(app);
let io = require("socket.io")(http);

let generatedId = function() {
  return "" + Math.floor(Math.random() * 10000000000000000);
};

let sessions = [];

io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("login", () => {
    console.log("in socket login");
    MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
      if (err) throw err;
      let dbo = db.db(DB_NAME);
      dbo
        .collection(DB_COLLECTION_MSG)
        .find({})
        .toArray((err, result) => {
          if (err) throw err;
          let lastMessages = result.reverse().slice(0, 20);
          socket.emit("messages", lastMessages);
        });
      db.close();
    });
  });

  socket.on("newmessage", message => {});
});

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
  MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
    if (err) throw err;
    let dbo = db.db(DB_NAME);
    dbo.collection(DB_COLLECTION_MSG).insertOne(newMsg, (err, result) => {
      if (err) throw err;
      res.send(JSON.stringify({ success: true }));
    });
    db.close();
  });
});

app.get("/messages", function(req, res) {
  console.log("/messages endpoint");
  let sessionId = req.headers.cookie;
  if (sessions[sessionId] !== undefined) {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
      if (err) throw err;
      let dbo = db.db(DB_NAME);
      dbo
        .collection(DB_COLLECTION_MSG)
        .find({})
        .toArray((err, result) => {
          if (err) throw err;
          let lastMessages = result.reverse().slice(0, 20);
          res.send(JSON.stringify({ success: true, messages: lastMessages }));
        });
      db.close();
    });
  }
});

app.post("/logout", function(req, res) {
  console.log("/logout endpoint");
  let sessionId = req.headers.cookie;
  if (sessions[sessionId]) {
    let username = sessions[sessionId];
    delete sessions[sessionId];

    MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
      if (err) throw err;
      let newMsg = {
        username: username,
        message: " has logged out.",
        time: new Date().toLocaleTimeString()
      };
      let dbo = db.db(DB_NAME);
      dbo.collection(DB_COLLECTION_MSG).insertOne(newMsg, (err, result) => {
        if (err) throw err;
        res.send(JSON.stringify({ success: true }));
      });
      db.close();
    });
  } else {
    res.send(JSON.stringify({ success: false }));
  }
});

app.post("/doesuserexist", function(req, res) {
  console.log("/doesuserexist endpoint");
  let body = JSON.parse(req.body);
  let username = body.username;
  MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
    if (err) throw err;
    let dbo = db.db(DB_NAME);
    dbo
      .collection(DB_COLLECTION_PWD)
      .find({ user: username })
      .toArray((err, result) => {
        if (err) throw err;
        if (result.length === 0) {
          res.send(JSON.stringify({ success: false }));
        } else {
          res.send(JSON.stringify({ success: true }));
        }
      });
    db.close();
  });
});

app.post("/signup", function(req, res) {
  console.log("/signup endpoint");
  let body = JSON.parse(req.body);
  let username = body.username;
  let password = body.password;

  MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
    if (err) throw err;
    let dbo = db.db(DB_NAME);
    let newUser = {
      user: username,
      pwd: password
    };
    dbo.collection(DB_COLLECTION_PWD).insertOne(newUser, (err, result) => {
      if (err) throw err;
      res.send(JSON.stringify({ success: true }));
    });
    db.close();
  });
});

app.post("/login", function(req, res) {
  console.log("/login endpoint");
  let body = JSON.parse(req.body);
  let username = body.username;
  let password = body.password;

  MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
    if (err) throw err;
    let dbo = db.db(DB_NAME);

    dbo
      .collection(DB_COLLECTION_PWD)
      .findOne({ user: username }, (err, result) => {
        if (err) throw err;
        if (result.pwd === password) {
          id = generatedId();
          sessions[id] = username;
          res.set("Set-Cookie", "" + id);
          let newMsg = {
            username: username,
            message: " has logged in.",
            time: new Date().toLocaleTimeString()
          };
          dbo.collection(DB_COLLECTION_MSG).insertOne(newMsg, (err, result) => {
            if (err) throw err;
            res.send(JSON.stringify({ success: true, username: username }));
          });
        } else {
          res.send(JSON.stringify({ success: false }));
        }
        db.close();
      });
  });
});

app.listen(4000);
io.listen(4001);
