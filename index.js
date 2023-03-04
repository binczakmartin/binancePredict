/*******************************************************************************
** entry point
** BINCZAK Martin - 2023
*******************************************************************************/

import argsParser from 'args-parser';
import { title } from './src/utils/ui.js';
import { saveAllKlines, getMarkets } from './src/binance/getKlines.js';
import { trainModel } from './src/tensorflow/train.js';

const parsearguments = async function () {
  const args = argsParser(process.argv);
  console.log('args => ', args);

  if (args['g']) {
    await saveAllKlines();
  }
  if (args['t']) {
    const markets = await getMarkets();
    for (let market of markets) {
      await trainModel('20230304', market.symbol);
    }
  }
  else {
    console.log('help');
  }
}

title();
parsearguments();