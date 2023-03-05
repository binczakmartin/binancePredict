import fs from "fs";
import * as tf from '@tensorflow/tfjs-node';
import { savedModelPath } from "../constants.js";
import { resolve } from "path";

export const loadModel = async function (pair) {
  let model;

  if (fs.existsSync(`${savedModelPath}/${pair}/model.json`)) {
    model = await tf.loadLayersModel(`file://${resolve(savedModelPath)}/${pair}/model.json`);
    model.compile({ loss: "meanSquaredLogarithmicError", optimizer: 'adam' });
    return model;
  }

  const leakyAlpha = 0.2;

  const input = tf.input({ shape: [5] });
  const dense1 = tf.layers.dense({
    units: 128,
    kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
  }).apply(input);
  const activation1 = tf.layers.leakyReLU({ alpha: leakyAlpha }).apply(dense1);
  const dropout1 = tf.layers.dropout({ rate: 0.5 }).apply(activation1);
  const dense2 = tf.layers.dense({
    units: 64,
    activation: 'relu',
    kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
  }).apply(dropout1);
  const dropout2 = tf.layers.dropout({ rate: 0.4 }).apply(dense2);
  const dense3 = tf.layers.dense({
    units: 32,
    activation: 'relu',
    kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
  }).apply(dropout2);
  const dropout3 = tf.layers.dropout({ rate: 0.3 }).apply(dense3);
  const dense4 = tf.layers.dense({
    units: 16,
    activation: 'relu',
    kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
  }).apply(dropout3);
  const dropout4 = tf.layers.dropout({ rate: 0.2 }).apply(dense4);
  const output = tf.layers.dense({
    units: 1,
    activation: 'sigmoid',
    kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
  }).apply(dropout4);

  model = tf.model({ inputs: input, outputs: output });
  model.compile({ loss: "binaryCrossentropy", optimizer: tf.train.adam() });

  return model;
};
