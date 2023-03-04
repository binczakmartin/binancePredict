
/*******************************************************************************
** Get Binance quoteAsset Markets
** BINCZAK Martin - 2023
*******************************************************************************/

import axios from 'axios';
import { quoteAsset } from '../constants.js';

export const getMarkets = async function () {
  let data = [];

  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr', {
        timeout: 40000
      });
      for (var i = 0; i < response.data.length; i++) {
        for (var q of quoteAsset) {
          if (response.data[i].symbol.endsWith(q)) {
            data.push(response.data[i]);
          }
        }
      }
      data = data.sort(function (a, b) { return b.quoteVolume - a.quoteVolume });
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
};