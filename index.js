/*******************************************************************************
** entry point
** BINCZAK Martin - 2023
*******************************************************************************/

import argsParser from 'args-parser';
import { title } from './src/utils/ui.js';
import { getAllKlines } from './src/binance/getKlines.js';
import { trainModel } from './src/tensorflow/train.js';

const parsearguments = async function () {
  const args = argsParser(process.argv);
  console.log('args => ', args);

  if (args['g']) {
    await getAllKlines();
  }
  if (args['t']) {
    const savedModelPath = './model'
    await trainModel(savedModelPath);
  }
  else {
    console.log('help');
  }
}

title();
parsearguments();