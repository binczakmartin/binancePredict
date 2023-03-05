/*******************************************************************************
** entry point
** BINCZAK Martin - 2023
*******************************************************************************/

import argsParser from 'args-parser';
import { printAsciiArt, help } from './src/utils/ui.js';
import { saveAllCandles } from './src/binance/candles.js';
import { getMarkets } from './src/binance/markets.js'
import { trainModel } from './src/tensorflow/train.js';
import { predictNextClose } from './src/tensorflow/predict.js'
import { getProxies } from './src/utils/proxy.js';
import { proxy } from './src/constants.js';

const parsearguments = async function () {
  const args = argsParser(process.argv);
  const markets = await getMarkets();
  const proxies = getProxies();

  switch (true) {
    case args['fetch']:
      console.log('Downloading and saving Binance data to data folder...');
      await saveAllCandles(proxies);
      break;

    case args['train']:
      console.log('Training TensorFlow model for all trading pairs...');
      for (let market of markets) {
        await trainModel('20230305', market.symbol);
      }
      break;

    case args['predict']:
      console.log('Predict crypto price with the trained model...');
      for (let market of markets) {
        await predictNextClose('20230305', market.symbol);
      }
      break;

    case args['delete']:
      console.log('delte the trained model...');
      break;

    default:
      help();
  }
}


printAsciiArt();
parsearguments();