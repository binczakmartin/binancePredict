/*******************************************************************************
** Predict future close price
** BINCZAK Martin - 2023
*******************************************************************************/

import fs from 'fs';
import tf from '@tensorflow/tfjs-node';
import { resolve } from 'path';

const getFeatures = function (pair, date, interval) {
  const features = [];
  const filePath = `./data/${date}/${pair}/${interval}/kline.json`;

  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath));
  
    for (let i = 0; i < data.length - 1; i++) {
      features.push([...data[i]].map((x) => parseInt(x, 10)));
    }
  } else {
    console.error(`File not found: ${filePath}`);
  }

  return features;
};

const getLabels = function (pair, date, interval) {
  const labels = [];
  const filePath = `./data/${date}/${pair}/${interval}/kline.json`;

  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath));

    for (let i = 0; i < data.length - 1; i++) {
      labels.push(parseFloat(data[i + 1][1])); // thast what we need to found
    }
  } else {
    console.error(`File not found: ${filePath}`);
  }

  console.log("labels", labels);
  return labels;
};

const loadModel = async function(savedModelPath) {
  let model;

  if (fs.existsSync(`${savedModelPath}/model.json`)) {
    model = await tf.loadLayersModel(`file://${resolve(savedModelPath)}/model.json`);
    console.log('Loaded model from disk');
  } else {
    model = tf.sequential();
    model.add(tf.layers.dense({ units: 64, inputShape: [24], activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1 }));
  }

  return model;
}

export const trainModel = async function (savedModelPath) {
  const features5m = getFeatures('ADAUSDT', '20230304', '5m');
  const features15m = getFeatures('ADAUSDT', '20230304', '15m');
  const labels = getLabels('ADAUSDT', '20230304', '15m');

  if (features5m.length !== features15m.length) {
    console.error('Features have different lengths');
    return;
  }

  const xs5min = tf.tensor2d(features5m);
  const xs30min = tf.tensor2d(features15m);
  const xs = tf.concat([xs5min, xs30min], 1);
  const ys = tf.tensor1d(labels);

  const model = await loadModel(savedModelPath);

  model.compile({ loss: 'meanSquaredError', optimizer: 'adam' });
  await model.fit(xs, ys, { epochs: 100 });
  await model.save(`file://${resolve(savedModelPath)}`);
  console.log('Saved model to disk');
};
