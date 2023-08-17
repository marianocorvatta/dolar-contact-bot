
const express = require("express");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const { sendMessage, getTemplatedMessageInput } = require("./messageHelper.js");

app.get("/", (req, res) => {
  res.send("Hello dolar-contact !");
});

const token = process.env.TOKEN;

app.get("/webhooks", (req, res) => {
  console.log("verify_token", req.query["hub.verify_token"]);
  if (
    req.query["hub.mode"] == "subscribe" &&
    req.query["hub.verify_token"] == token
  ) {
    res.send(req.query["hub.challenge"]);
  } else {
    res.sendStatus(400);
  }
});

app.post("/webhooks", (req, res) => {
  const body = JSON.parse(req.body);
  if (body.field !== "messages") {
    // not from the messages webhook so dont process
    return res.sendStatus(400);
  }
  const review = {
    phonenumber: body.value.metadata.display_phone_number,
    review: body.value.messages
      .map((message) => message.text.body)
      .join("\n\n"),
  };

  const data = getTemplatedMessageInput(process.env.RECIPIENT_WAID);
  
  sendMessage(data)
    .then(function (response) {
      res.redirect('/catalog');
      return;
    })
    .catch(function (error) {
      console.log(error);
      return;
    });

  console.log("reviewInfo", review);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
