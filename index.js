/*******************************************************************************
** Entry point
** BINCZAK Martin - 2023
*******************************************************************************/

import argsParser from 'args-parser';
import moment from 'moment';
import { printAsciiArt, help } from './src/utils/ui.js';
import { saveAllCandles } from './src/binance/candles.js';
import { getMarkets } from './src/binance/markets.js'
import { trainModel } from './src/tensorflow/train.js';
import { predictNextClose } from './src/tensorflow/predict.js'
import { getProxies } from './src/utils/proxy.js';
import { deletePathContents } from './src/utils/misc.js';
import { proxyFileSize, fileSize, predictfileSize } from './src/constants.js';

const parsearguments = async function () {
  const args = argsParser(process.argv);
  const date = moment();

  let proxies = args['p'] ? getProxies() : []
  let limit = proxies.length ? proxyFileSize : fileSize;
  let loop = args['l'] ? args['l'] : 1;

  switch (true) {
    case args['fetch']:
      await fetch(proxies, date, limit);
      break;

    case args['train']:
      await train(proxies, date, limit, loop);
      break;

    case args['predict']:
      await predict(proxies, date, limit);
      break;

    case args['delete']:
      await deleteModels();
      break;

    default:
      help();
  }
}

const fetch = async function(proxies, date, limit) {
  console.log('Downloading and saving Binance data to data folder...');

  await saveAllCandles(proxies, date.format('YYYYMMDD'), limit);
}

const train = async function(proxies, date, limit, loop) {
  const markets = await getMarkets();

  console.log(`Start ${loop} session of training\n`);

  for (let i = 0; i < loop; i++) {
    
    console.log('Training TensorFlow model for all trading pairs...');
    for (let market of markets) {
      await trainModel(date.format('YYYYMMDD'), market.symbol);
    }

    console.log('Downloading Binance data before training ..');
    await saveAllCandles(proxies, date.format('YYYYMMDD'), limit);
  }
}

const predict = async function(proxies, date) {
  const markets = await getMarkets();
  
  console.log('Downloading Binance data for prediction ..');
  await saveAllCandles(proxies, date.format('YYYYMMDD'), predictfileSize);
  
  console.log('Predict all crypto prices with the trained models...');
  for (let market of markets) {
    await predictNextClose(date.format('YYYYMMDD'), market.symbol);
  }
}

const deleteModels = async function() {
  console.log('All the models are deleted \n');

  deletePathContents('./models')
}

printAsciiArt();
parsearguments();