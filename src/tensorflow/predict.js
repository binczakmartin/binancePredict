/*******************************************************************************
** Train the model
** BINCZAK Martin - 2023
*******************************************************************************/

import * as tf from '@tensorflow/tfjs-node-gpu';
import { getFeatures } from "../utils/transform.js";
import { loadModel } from './model.js';

export const predictNextClose = async function (date, pair) {
  const model = await loadModel(pair);

  let data = getFeatures(pair, date, '1h');
  data = data.map((elem) => elem.slice(1, 6));

  const newTensor = tf.tensor2d(data);
  
  const nextClosingPrice = model.predict(newTensor).dataSync()[0];

  // console.log([data[data.length - 1].slice(1, 5)]);
  console.log(`\x1b[38;5;178m${pair}\x1b[0m `, nextClosingPrice);
};
