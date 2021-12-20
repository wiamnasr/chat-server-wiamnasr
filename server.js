const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [
  {
    id: 0,
    from: "Bart",
    text: "Welcome to CYF chat system!",
  },
];

app.get("/messages/latest", (req, res) => {
  const displayLatest = [];
  const reversedMessagesArray = messages.reverse();
  const limit =
    reversedMessagesArray.length < 10 ? reversedMessagesArray.length : 10;
  for (let i = 0; i < limit; i++) {
    displayLatest.push(reversedMessagesArray[i]);
  }

  return res.send(displayLatest);
});

app.get("/messages/search", (req, res) => {
  const searchTerm = req.query.text.toUpperCase();

  if (searchTerm) {
    const matchingTexts = messages.filter((message) =>
      message.text.toUpperCase().includes(searchTerm)
    );
    if (matchingTexts.length > 0) {
      return res.send(matchingTexts);
    }
    return res.status(404).json({
      success: false,
      msg: `No texts match your search term ("${searchTerm}")`,
    });
  }
});

app.delete("/messages/:id", (req, res) => {
  const searchId = req.params.id;
  if (searchId) {
    const remainingMessages = messages.filter(
      (message) => message.id !== Number(searchId)
    );
    if (remainingMessages.length > 0) {
      return res.send(remainingMessages);
    }
    return res.status(404).json({
      success: false,
      msg: `Requested id does not exist (${searchId})`,
    });
  }
});

app.get("/messages/:id", (req, res) => {
  const searchId = req.params.id;
  if (searchId) {
    const matchingId = messages.filter(
      (message) => message.id === Number(searchId)
    );
    if (matchingId.length > 0) {
      return res.send(matchingId);
    }
    return res.status(404).json({
      success: false,
      msg: `Requested id does not exist (${searchId})`,
    });
  }
});

app.post("/messages", (req, res) => {
  if (!req.body.from || !req.body.text) {
    return res
      .status(404)
      .json({ success: false, msg: "Name and Message cannot be empty" });
  }
  messages.push({
    id: Math.random(),
    from: req.body.from,
    text: req.body.text,
  });

  console.log(req.body);
  return res.status(200).send(messages);
});

app.get("/messages", (req, res) => {
  return res.status(200).json({ success: true, messages });
});

app.get("/", function (request, response) {
  return response.status(200).sendFile(__dirname + "/index.html");
});

app.get("/*", function (request, response) {
  return response.status(404).json({
    success: false,
    msg: "Not within my APIs reach...",
    methods: {
      home: "/",
      messages: "/messages",
      specific-message: "/messages/:id",
      textSearch: "/messages/search?text=...",
      latestMessages: "/messages/latest",
    },
  });
});

// process.env.PORT

app.listen(5000, () => console.log("listening at 5000..."));
