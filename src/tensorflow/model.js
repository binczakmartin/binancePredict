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

  if (fs.existsSync(`${savedModelPath}/model.json`)) {
    model = await tf.loadLayersModel(
      `file://${resolve(savedModelPath)}/model.json`
    );
  } else {
    // Define a new model architecture
    const input = tf.input({ shape: [5] });

    const normalizeLayer = tf.layers.batchNormalization({});
    const normalizedInput = normalizeLayer.apply(input);

    const dense1 = tf.layers.dense({
      units: 64,
      activation: "relu",
      kernelRegularizer: tf.regularizers.l2({l2: 0.001}),
    }).apply(normalizedInput);
    const dropout1 = tf.layers.dropout({rate: 0.15}).apply(dense1);

    const dense2 = tf.layers.dense({
      units: 32,
      activation: "softmax",
      kernelRegularizer: tf.regularizers.l2({l2: 0.001}),
    }).apply(dropout1);
    const dropout2 = tf.layers.dropout({rate: 0.1}).apply(dense2);

    const dense3 = tf.layers.dense({
      units: 16,
      activation: "linear",
      kernelRegularizer: tf.regularizers.l2({l2: 0.05}),
    }).apply(dropout2);
    const dropout3 = tf.layers.dropout({rate: 0.07}).apply(dense3);

/*
    const dense4 = tf.layers.dense({
      units: 75,
      activation: "relu",
      kernelRegularizer: tf.regularizers.l2({l2: 0.001}),
    }).apply(dropout3);
    const dropout4 = tf.layers.dropout({rate: 0.06}).apply(dense4);

    const dense5 = tf.layers.dense({
      units: 50,
      activation: "relu",
      kernelRegularizer: tf.regularizers.l2({l2: 0.001}),
    }).apply(dropout4);
    const dropout5 = tf.layers.dropout({rate: 0.05}).apply(dense5);

    const dense6 = tf.layers.dense({
      units: 25,
      activation: "relu",
      kernelRegularizer: tf.regularizers.l2({l2: 0.001}),
    }).apply(dropout5);
    const dropout6 = tf.layers.dropout({rate: 0.04}).apply(dense6);

    const dense7 = tf.layers.dense({
      units: 10,
      activation: "relu",
      kernelRegularizer: tf.regularizers.l2({l2: 0.001}),
    }).apply(dropout6);
    const dropout7 = tf.layers.dropout({rate: 0.03}).apply(dense7);

    const dense10 = tf.layers.dense({
      units: 4,
      activation: "relu",
      kernelRegularizer: tf.regularizers.l2({l2: 0.001}),
    }).apply(dropout7);
    const dropout10 = tf.layers.dropout({rate: 0.01}).apply(dense10);
*/
    const output = tf.layers.dense({
      units: 1,
      activation: "linear",
      kernelRegularizer: tf.regularizers.l2({l2: 0.001}),
    }).apply(dropout3);
    model = tf.model({ inputs: input, outputs: output });
  }

  model.compile({
    optimizer: tf.train.adam(),
    loss: "",
  });

  return model;
};
