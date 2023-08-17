const express = require("express");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello dolar-contact !");
});

app.post("/webhook", (req, res, next) => {
  console.log("message body", req.body);

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
