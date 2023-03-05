/*******************************************************************************
** Model structure
** BINCZAK Martin - 2023
*******************************************************************************/

import fs from "fs";
import * as tf from '@tensorflow/tfjs-node-gpu';
import { savedModelPath } from "../constants.js";
import { resolve } from "path";

export const loadModel = async function (pair) {
  let model;

  if (fs.existsSync(`${savedModelPath}/${pair}/model.json`)) {
    model = await tf.loadLayersModel(`file://${resolve(savedModelPath)}/${pair}/model.json`);
    model.compile({ loss: "meanSquaredLogarithmicError", optimizer: 'adam' });
    return model;
  }

  model = tf.sequential();
  model.add(tf.layers.dense({
    units: 64,
    activation: 'relu',
    inputShape: [5],
    kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
  }));
  model.add(tf.layers.dropout({ rate: 0.3 }));
  model.add(tf.layers.dense({
    units: 32,
    activation: 'relu',
    kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
  }));
  model.add(tf.layers.dropout({ rate: 0.2 }));
  model.add(tf.layers.dense({
    units: 16,
    activation: 'relu',
    kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
  }));
  model.add(tf.layers.dropout({ rate: 0.2 }));
  model.add(tf.layers.dense({
    units: 1,
    kernelRegularizer: tf.regularizers.l2({ l2: 0.01 })
  }));

  model.compile({ loss: "meanSquaredError", optimizer: 'adam' });

  return model;
};
