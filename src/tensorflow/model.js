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
      units: 100,
      activation: "relu",
    }).apply(normalizedInput);
    const dense2 = tf.layers.dense({
      units: 98,
      activation: "relu",
    }).apply(dense1);
    const dense3 = tf.layers.dense({
      units: 96,
      activation: "relu",
    }).apply(dense2);
    const output = tf.layers.dense({
      units: 1,
      activation: "relu",
    }).apply(dense3);
    model = tf.model({ inputs: input, outputs: output });
  }

  model.compile({
    optimizer: tf.train.adam(),
    loss: "meanSquaredLogarithmicError",
  });

  return model;
};
