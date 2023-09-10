import axios from 'axios';
import cheerio from 'cheerio';
import { getDateTime } from '../utils/getDateTime.js';

/**
 * @description Obtener el valor del dolar blue
 * @returns Un objeto con el valor de compra, el de venta
 */
export function getDolarBlue() {
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
