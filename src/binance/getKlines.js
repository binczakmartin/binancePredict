
/*******************************************************************************
** Get Binance Klines data
** BINCZAK Martin - 2023
*******************************************************************************/

import { getDateStr } from '../utils/misc.js';
import axios from 'axios';
import fs from 'fs';

/* get only USDT pairs */
const quoteAsset = ["USDT"];

/* time intervals 1m, 5m, 15m, 30m, 1h ...  */
const intervals = ["1h"];

/* get markets data list */
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
  })
};

/* get all interval candlestick data by pair */
export const getKlines = async function (symbol) {
  let dataObj = {};

  return new Promise(async (resolve, reject) => {
    try {
      dataObj[symbol] = {};
      for (var interval of intervals) {
        const response = await axios.get('https://api.binance.com/api/v3/klines', {
          timeout: 40000,
          params: {
            'symbol': symbol,
            'interval': interval
          }
        });
        // sleep to reduce call weight and avoid ban
        await new Promise(resolve => setTimeout(resolve, 30));
        if (response.headers['x-mbx-used-weight-1m'] > 850) {
          await new Promise(resolve => setTimeout(resolve, 60000));
        }
        const folder = `./data/${getDateStr()}/${symbol}/${interval}/`;
        await fs.promises.mkdir(folder, { recursive: true });
        fs.writeFileSync(`${folder}/kline.json`, JSON.stringify(response.data));
        dataObj[symbol][interval] = response.data;
      }
      resolve(dataObj[symbol])
    } catch (e) {
      reject(e);
    }
  })
};

/* get the data for all the pairs by chunks */
export const getAllKlines = async function () {
  let dataObj = {}
  let pTab = [];

  return new Promise(async (resolve, reject) => {
    try {
      let data = await getMarkets();
      const length = Math.floor(data.length / 2); // only top volume for the moment to avoid ban
      data = data.slice(0, length);
      for (let elem of data) {
        pTab.push(getKlines(elem.symbol));
        if (pTab.length % 20 == 0) { // avoid ban only chunks of 20
          await Promise.all(pTab);
          await new Promise(resolve => setTimeout(resolve, 2600));
          pTab = [];
        }
      }
      await Promise.all(pTab);
      resolve(dataObj);
    } catch (e) {
      reject(e);
    }
  })
}