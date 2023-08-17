const express = require("express");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello dolar-contact !");
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

  console.log("reviewInfo", review);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
