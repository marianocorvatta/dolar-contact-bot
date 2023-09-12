
import express from 'express';
import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import { getDolarBlue } from './services/getDolarBlue.js';
import { getEuroBlue } from './services/getEuroBlue.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const token = process.env.TELEGRAM_API_KEY;
const bot = new TelegramBot(token, {polling: true});


// Peso to Dolar
// Matches "/dolar [number]"
bot.onText(/\/dolar (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const amount = +match[1];
  bot.sendMessage(chatId, 'Procesando...');
  const data = await getDolarBlue()
  const response = (amount / data.venta).toLocaleString('es-AR', { style:"currency", currency:"USD", maximumFractionDigits: 2 })
  // send back the amount in USD
  bot.sendMessage(chatId, response);
  sendResponseOrdered(chatId, data, 'US$');
});

// Dolar to ARS
// Matches "/dolarpeso [number]"
bot.onText(/\/dolarpeso (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const amount = +match[1];
  bot.sendMessage(chatId, 'Procesando...');
  const data = await getDolarBlue()
  const response = (amount * data.compra).toLocaleString('es-AR', { style:"currency", currency:"ARS", maximumFractionDigits: 2 }) 
  // send back the amount in ARS
  bot.sendMessage(chatId, response);
  sendResponseOrdered(chatId, data, 'US$');
});

// ARS to Euro
// Matches "/euro [number]"
bot.onText(/\/euro (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const amount = +match[1];
  bot.sendMessage(chatId, 'Procesando...');
  const data = await getEuroBlue()
  const response = (amount / data.venta).toLocaleString('es-AR', { style:"currency", currency:"EUR", maximumFractionDigits: 2 })
  // send back the amount in EUR
  bot.sendMessage(chatId, response);
  sendResponseOrdered(chatId, data, '€');
});

// Euro to Peso
// Matches "/europeso [number]"
bot.onText(/\/europeso (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const amount = match[1];
  bot.sendMessage(chatId, 'Procesando...');
  const data = await getEuroBlue()
  const response = (amount * data.compra).toLocaleString('es-AR', { style:"currency", currency:"ARS", maximumFractionDigits: 2 })
  // send back the amount in ARS
  bot.sendMessage(chatId, response);
  sendResponseOrdered(chatId, data, '€');
});

async function sendResponseOrdered(chatId, data, currency) {
  try {
    await bot.sendMessage(chatId, `Fecha: ${data.date}`);
    await bot.sendMessage(chatId, `Compra: ${currency} ${data.compra}`);
    await bot.sendMessage(chatId, `Venta: ${currency} ${data.venta}`);
  } catch (error) {
    console.error('Error al enviar mensajes:', error);
  }
}

app.get("/", (req, res) => {
  res.send("Hello dolar-contact-bot !");
});

app.listen(port, () => {
  console.log(`Dolar contact bot listening on port ${port}`);
});
