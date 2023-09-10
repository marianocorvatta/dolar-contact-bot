
const express = require("express");
const convert = require('xml-js');
const axios = require('axios');

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
  const response = (amount / +data.venta).toFixed(2)  
  // send back the amount in USD
  bot.sendMessage(chatId, response);
});

// Dolar to Peso
// Matches "/dolarpeso [number]"
bot.onText(/\/dolarpeso (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const amount = +match[1];
  bot.sendMessage(chatId, 'Procesando...');
  const data = await getDolarBlue()
  const response = (amount * +data.venta).toFixed(2)  

  // send back the amount in ARS
  bot.sendMessage(chatId, response);
});

// Peso to Euro
// Matches "/euro [number]"
bot.onText(/\/euro (.+)/, async (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, 'Procesando...');
  const data = await getEuroBlue()

  // send back the amount in EUR
  bot.sendMessage(chatId, resp);
});

// Euro to Peso
// Matches "/europeso [number]"
bot.onText(/\/europeso (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, 'Procesando...');

  // send back the amount in EUR
  bot.sendMessage(chatId, resp);
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
 * @returns Un objeto con el valor de compra, el de venta y la fecha y hora de la consulta
 */
async function getDolarBlue() {
  try {
      const data = await getInfoDolar();
      const values = {
          fecha: getDateTime(),
          compra: formatNumber(data.cotiza.Dolar.casa380.compra._text),
          venta: formatNumber(data.cotiza.Dolar.casa380.venta._text)
      };

      return values;
  } catch (e) {
      console.log(e);
  }
}

/**
 * @description Obtener el valor del euro blue
 * @returns Un objeto con el valor de compra, el de venta y la fecha y hora de la consulta
 */
async function getEuroBlue() {
  try {
      // const data = await getInfoDolar();
      // console.log('euro', data.cotiza.Euro)
      // const values = {
      //     fecha: getDateTime(),
      //     compra: formatNumber(data.cotiza.Dolar.casa380.compra._text),
      //     venta: formatNumber(data.cotiza.Dolar.casa380.venta._text)
      // };

      // return values;
  } catch (e) {
      console.log(e);
  }
}

/**
 * @description Obtener un json parseado con los valores de dolarSi
 */
async function getInfoDolar() {
  try {
      const dataDolar = await axios.get("https://www.dolarsi.com/api/dolarSiInfo.xml");
      const json = convert.xml2json(dataDolar.data, { compact: true, spaces: 4 });
      const jsonParsed = JSON.parse(json);

      return jsonParsed;
  } catch (e) {
      console.log(e);
      return null;
  }
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

/**
 * Formatea un texto numérico a formato moneda.
 * @param {string} value Texto que contiene el valor numérico a convertir.
 * @param {number} decimalPlaces Cantidad de caracteres decimales a conservar.
 * @returns {string} Valor formateado como moneda.
 */
function formatNumber(value, decimalPlaces) {
  const decimals = decimalPlaces || 2;
  const convertedValue = parseFloat(value.replace('.', '').replace(',', '.'));
  return !isNaN(convertedValue) ? convertedValue.toFixed(decimals) : 'No cotiza';
}

/**
 * Devuelve un objeto que contiene los valores de la cotización anual por mes.
 * @param {object} evolucionAnual Objeto que contiene el valor de cada mes del año.
 * @returns {object} Objeto con la fecha actual y un arreglo de meses.
 */
function getEvolucion(evolucionAnual) {
  const now = new Date();
  const mesActual = now.getMonth() + 1;

  let meses = [];
  for (let i = 1; i <= Object.keys(evolucionAnual).length; i++) {
      meses.push({
          "anio": (i < mesActual ? now.getFullYear() : now.getFullYear() - 1).toString(),
          "mes": i.toString(),
          "valor": formatNumber(evolucionAnual[[Object.keys(evolucionAnual)[i - 1]]]._text).toString()
      });
  }
  meses = meses.sort((a, b) => a.anio - b.anio);

  const valores = {
      fecha: getDateTime(),
      meses
  };

  return valores;
}
