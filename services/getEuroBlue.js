import axios from 'axios';
import cheerio from 'cheerio';
import { getDateTime } from '../utils/getDateTime.js';

/**
 * @description Obtener el valor del euro blue
 * @returns Un objeto con el valor de compra, el de venta
 */
export function getEuroBlue() {
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