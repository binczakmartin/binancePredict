/*******************************************************************************
** Predict future close price
** BINCZAK Martin - 2023
*******************************************************************************/

import fs from 'fs';
import tf from '@tensorflow/tfjs-node';
import { resolve } from 'path';
import { intervals, savedModelPath } from '../constants.js';
import { resizeArrays } from '../utils/misc.js';

const getFeatures = function (pair, date, interval) {
  const features = [];
  const filePath = `./data/${date}/${pair}/${interval}/kline.json`;

  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath));
    for (let i = 0; i < data.length - 1; i++)
      features.push([...data[i]].map((x) => parseInt(x, 10)));
    return features;
  }

  console.error(`File not found: ${filePath}`);
  return features;
};

const getLabels = function (pair, date, interval) {
  const labels = [];
  const filePath = `./data/${date}/${pair}/${interval}/kline.json`;

  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath));
    for (let i = 0; i < data.length - 1; i++)
      labels.push(parseFloat(data[i + 1][1]));
    return labels;
  }

  console.error(`File not found: ${filePath}`);
  return labels;
};

const loadModel = async function() {
  let model;
  let inputs = [];
  let denses = [];

  if (fs.existsSync(`${savedModelPath}/model.json`)) {
    model = await tf.loadLayersModel(`file://${resolve(savedModelPath)}/model.json`);
    console.log('Loaded model from disk');
  } else {
    for (let interval of intervals) {
      const input = tf.input({ shape: 12 });
      inputs.push(input);
      denses.push(tf.layers.dense({ units: 32, activation: "relu" }).apply(input));
    }
    const concatenate = tf.layers.concatenate().apply(denses);
    const output = tf.layers.dense({ units: 1, activation: "linear" }).apply(concatenate);
    model = tf.model({ inputs: inputs, outputs: output });
  }

  return model;
}

export const trainModel = async function (date, pair) {
  let features = [];
  let tensors = [];
  let model = await loadModel();
  let labels = getLabels(pair, date, '1h');
  let normalizedArrays = {};

  for (let interval of intervals) {
    features.push(getFeatures(pair, date, interval));
  }
  
  normalizedArrays = resizeArrays(features, labels);

  for (let feature of normalizedArrays.features) {
    if (!feature.length) return;
      tensors.push(tf.tensor2d(feature, [feature.length, feature[0].length]));
  }

  model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });
  await model.fit(tensors, tf.tensor1d(normalizedArrays.labels), { epochs: 25 });

  await model.save(`file://${resolve(savedModelPath)}`);
  console.log('Saved model to disk');
};
