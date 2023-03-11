/*******************************************************************************
** Model structure
** BINCZAK Martin - 2023
*******************************************************************************/

import fs from "fs";
import * as tf from "@tensorflow/tfjs-node";
import { savedModelPath } from "../constants.js";
import { resolve } from "path";

export const loadModel = async function (pair) {
  let model;

  if (fs.existsSync(`${savedModelPath}/${pair}/model.json`)) {
    model = await tf.loadLayersModel(
      `file://${resolve(savedModelPath)}/${pair}/model.json`
    );
  } else {
    // Define a new model architecture
    const input = tf.input({ shape: [5] });

    const normalizeLayer = tf.layers.batchNormalization({});
    const normalizedInput = normalizeLayer.apply(input);

    const dense1 = tf.layers.dense({
      units: 768,
      activation: "relu",
      kernelRegularizer: tf.regularizers.l2({l2: 0.001}),
    }).apply(normalizedInput);
    const dropout1 = tf.layers.dropout({rate: 0.03}).apply(dense1);

    const dense2 = tf.layers.dense({
      units: 256,
      activation: "linear",
      kernelRegularizer: tf.regularizers.l2({l2: 0.001}),
    }).apply(dropout1);
    const dropout2 = tf.layers.dropout({rate: 0.02}).apply(dense2);

    const dense4 = tf.layers.dense({
      units: 128,
      activation: "relu",
      kernelRegularizer: tf.regularizers.l2({l2: 0.001}),
    }).apply(dropout2);
    const dropout4 = tf.layers.dropout({rate: 0.01}).apply(dense4);

    const output = tf.layers.dense({
      units: 1,
      activation: "relu",
      kernelRegularizer: tf.regularizers.l2({l2: 0.001}),
    }).apply(dropout4);
    model = tf.model({ inputs: input, outputs: output });
  }

  model.compile({
    optimizer: tf.train.adamax(),
    loss: "meanSquaredLogarithmicError",
  });

  return model;
};
