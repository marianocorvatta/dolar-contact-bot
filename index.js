
const express = require("express");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_API_KEY;

const bot = new TelegramBot(token, {polling: true});

// Matches "/dolar [number]"
bot.onText(/\/dolar (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, 'Proccesing...');

  // send back the amount in USD
  bot.sendMessage(chatId, resp);
});


// Matches "/peso [number]"
bot.onText(/\/peso (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, 'Proccesing...');

  // send back the amount in ARS
  bot.sendMessage(chatId, resp);
});

// Matches "/euro [number]"
bot.onText(/\/euro (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, 'Proccesing...');

  // send back the amount in EUR
  bot.sendMessage(chatId, resp);
});

// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, 'Received your message');
// });

app.get("/", (req, res) => {
  res.send("Hello dolar-contact-bot !");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
