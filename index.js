/*******************************************************************************
** entry point
** BINCZAK Martin - 2023
*******************************************************************************/

import argsParser from 'args-parser';
import { printAsciiArt, help } from './src/utils/ui.js';
import { saveAllCandles } from './src/binance/candles.js';
import { getMarkets } from './src/binance/markets.js'
import { trainModel } from './src/tensorflow/train.js';

const parsearguments = async function () {
  const args = argsParser(process.argv);

  if (args['g']) {
    console.log('Downloading and saving Binance data to data folder...');
    await saveAllCandles();
  } else if (args['t']) {
    console.log('Training TensorFlow model for all trading pairs...');
    const markets = await getMarkets();
    for (let market of markets) {
      await trainModel('20230305', market.symbol);
    }
  } else {
    help();
  }
}

printAsciiArt();
parsearguments();