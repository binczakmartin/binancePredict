/*******************************************************************************
** Predict future close price
** BINCZAK Martin - 2023
*******************************************************************************/

import fs from "fs";
import tf from "@tensorflow/tfjs-node";
import { loadModel } from './model.js';
import { resolve } from "path";
import { intervals, savedModelPath } from "../constants.js";
import { resizeArrays } from "../utils/misc.js";

const getFeatures = function (pair, date, interval) {
  const features = [];
  const filePath = `./data/${date}/${pair}/${interval}/kline.json`;

  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath));
    data.map((elem) => features.push([...elem].map((x) => parseFloat(x, 10))));
    return features;
  }

  return features;
};

const getLabels = function (pair, date, interval) {
  const labels = [];
  const filePath = `./data/${date}/${pair}/${interval}/kline.json`;

  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath));
    for (let i = 0; i < data.length - 1; i++) {
      labels.push(parseFloat(data[i + 1][1]));
    }
    return labels;
  }

  return labels;
};

export const trainModel = async function (date, pair) {
  let features = [];
  let tensors = [];
  let model = await loadModel();
  let labels = getLabels(pair, date, "1h");
  let normalizedArrays = {};

  for (let interval of intervals) {
    features.push(getFeatures(pair, date, interval));
  }

  normalizedArrays = resizeArrays(features, labels);
  console.log(normalizedArrays)

  for (let feature of normalizedArrays.features) {
    if (!feature.length) return;
    tensors.push(tf.tensor2d(feature, [feature.length, feature[0].length]));
  }

  model.compile({ loss: "meanSquaredError", optimizer: tf.train.adam(0.001) });
  await model.fit(tensors, tf.tensor1d(normalizedArrays.labels), { epochs: 200, batchSize: 128 });
  await model.save(`file://${resolve(savedModelPath)}`);
};
