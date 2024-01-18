var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var mongoose = require("mongoose");
var cors = require('cors');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

var dbUrl =
  "mongodb+srv://pavitkalra:pavitkalra@projectcluster.aluotcv.mongodb.net/NodejsPractice";

var Message = mongoose.model("Message", {
  name: String,
  message: String,
});

app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find({});
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.sendStatus(500);
  }
});

app.post("/messages", async (req, res) => {
  try {
    var message = new Message(req.body);
    await message.save();
  
    io.emit("message", req.body);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error saving message:", err);
    res.sendStatus(500);
  }
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    var server = http.listen(3000, () => {
      console.log("Server is listening on port", server.address().port);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
