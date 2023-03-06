
/*******************************************************************************
** Get binance candles files
** BINCZAK Martin - 2023
*******************************************************************************/

import fs from 'fs';
import axios from 'axios';
import { intervals } from '../constants.js';
import { getMarkets } from './markets.js';
import { proxyConcurrent, concurrent } from '../constants.js';

export const saveCandles = async function (symbol, proxy, date, limit) {
  let dataObj = {};

  return new Promise(async (resolve, reject) => {
    try {
      dataObj[symbol] = {};
      for (var interval of intervals) {
        const response = await axios.get('https://api.binance.com/api/v3/klines', {
          timeout: 180000,
          params: {
            'symbol': symbol,
            'interval': interval,
            'limit': limit
          },
          proxy
        });
        await new Promise(resolve => setTimeout(resolve, 30));
        if (response.headers['x-mbx-used-weight-1m'] > 500) {
          await new Promise(resolve => setTimeout(resolve, 40000));
        }
        const folder = `./data/${date}/${symbol}/${interval}/`;
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

export const saveAllCandles = async function (proxies, date, limit) {
  let dataObj = {}
  let pTab = [];
  let count = 0;

  const batchSize = proxies.length ? proxyConcurrent : concurrent;
  console.log("\nbatchSize", batchSize);

  return new Promise(async (resolve, reject) => {
    try {
      let data = await getMarkets();
      const length = Math.floor(data.length);
      data = data.slice(0, length);
      for (let elem of data) {
        if (count == proxies.lenght) count = 0;
        const proxy = proxies[count];
        pTab.push(saveCandles(elem.symbol, proxy, date, limit));
        if (pTab.length % batchSize == 0) {
          await Promise.all(pTab);
          await new Promise(resolve => setTimeout(resolve, 10000));
          pTab = [];
        }
        count++;
      }
      await Promise.all(pTab);
      resolve(dataObj);
    } catch (e) {
      reject(e);
    }
  })
}