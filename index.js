
const express = require("express");
const axios = require('axios');
const cheerio = require('cheerio');

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const TelegramBot = require('node-telegram-bot-api');

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
  bot.sendMessage(chatId, `Fecha: ${data.date}`);
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
  bot.sendMessage(chatId, `Fecha: ${data.date}`);
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
  bot.sendMessage(chatId, `Fecha: ${data.date}`);
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
  bot.sendMessage(chatId, `Fecha: ${data.date}`);
});

// bot.onText(/^(?!\/europeso$|\/euro$|\/dolar$|\/dolarpeso$).*/, (msg) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, 'Comando no válido. Por favor, utiliza uno de los comandos válidos: /europeso, /euro, /dolar, /dolarpeso');
// });

app.get("/", (req, res) => {
  res.send("Hello dolar-contact-bot !");
});

app.listen(port, () => {
  console.log(`Dolar contact bot listening on port ${port}`);
});

/**
 * @description Obtener el valor del dolar blue
 * @returns Un objeto con el valor de compra, el de venta
 */
async function getDolarBlue() {
  const url = 'https://dolarhoy.com/i/cotizaciones/dolar-blue';

  return axios.get(url)
  .then((response) => {
    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);

      const values = {}
      
      $('div.data__valores p').each((index, element) => {
        const valor = parseFloat($(element).text());
        const tipo = $(element).find('span').text();
      
        if (tipo === 'Compra') {
          values.compra = valor;
        } else if (tipo === 'Venta') {
          values.venta = valor;
        }
      });     

      values.date = getDateTime();

      return values;
    }
  })
  .catch((error) => {
    console.error('Error al hacer la solicitud HTTP:', error);
  });
}

/**
 * @description Obtener el valor del euro blue
 * @returns Un objeto con el valor de compra, el de venta
 */
function getEuroBlue() {
  const url = 'https://dolarhoy.com/cotizacion-euro';

  return axios.get(url)
    .then((response) => {
      if (response.status === 200) {
        const html = response.data;
        const $ = cheerio.load(html);

        const values = {}
        
        // element that contains the data we want to scrape
        const elementsInsideDiv = $('div.tile.is-parent.is-8 *');
  
        elementsInsideDiv.each((_, element) => {
          const text = $(element).text().trim();

          if (text.includes('Compra')) {
            values.compra = parseFloat($(element).next('.value').text().trim().replace('$', ''));
          } else if (text.includes('Venta')) {
            values.venta = parseFloat($(element).next('.value').text().trim().replace('$', ''));
          }
        });

        values.date = getDateTime();

        return values;
      }
    })
    .catch((error) => {
      console.error('Error al hacer la solicitud HTTP:', error);
    });
}

/**
 * Obtener la fecha y hora actual en un formato específico.
 * @returns {string} Fecha y hora en formato 'YYYY/MM/DD HH:mm:ss'.
 */
function getDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');

  return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
}
