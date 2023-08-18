
const express = require("express");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const { sendMessage, getTextMessageInput } = require("./sendmessage.js");

app.get("/", (req, res) => {
  res.send("Hello dolar-contact !");
});

const token = process.env.TOKEN;

app.get("/test", async (req, res) => {
  try {
    const resp = await sendMessage()
    console.log('resp', resp.data)
    res.status(200).send("Message sent!");
  } catch (error) {
    console.log(error);
  }
});

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

app.post("/webhooks", async (req, res) => {
  const body = JSON.parse(req.body);
  // if (body.field !== "messages") {
  //   // not from the messages webhook so dont process
  //   return res.sendStatus(400);
  // }
  // const review = {
  //   phonenumber: body.value.metadata.display_phone_number,
  //   review: body.value.messages
  //     .map((message) => message.text.body)
  //     .join("\n\n"),
  // };

  // var data = getTextMessageInput(process.env.RECIPIENT_WAID, 'Welcome to the Movie Ticket Demo App for Node.js!');
  
  // sendMessage(data)
  //   .then(function (response) {
  //     res.sendStatus(200);
  //     return;
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //     console.log(error.response.data);
  //     res.sendStatus(500);
  //     return;
  //   });
  const resp = await sendMessage()
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
