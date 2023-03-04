/*******************************************************************************
** Model structure
** BINCZAK Martin - 2023
*******************************************************************************/

import fs from "fs";
import tf from "@tensorflow/tfjs-node";
import { intervals, savedModelPath } from "../constants.js";
import { resolve } from "path";

export const loadModel = async function () {
  let model;
  let inputs = [];
  let denses = [];

  if (fs.existsSync(`${savedModelPath}/model.json`)) {
    model = await tf.loadLayersModel(`file://${resolve(savedModelPath)}/model.json`);
    return model;
  }
  
  intervals.map(() => {
    const input = tf.input({ shape: 12 });
    inputs.push(input);
    denses.push(tf.layers.dense({ units: 64, activation: "relu" }).apply(input));
  });

  const concatenate = tf.layers.concatenate().apply(denses);
  const dense = tf.layers.dense({ units: 128, activation: "relu" }).apply(concatenate);
  const dropout = tf.layers.dropout({ rate: 0.2 }).apply(dense);
  const output = tf.layers.dense({ units: 1, activation: "relu" }).apply(dropout);

  model = tf.model({ inputs: inputs, outputs: output });

  return model;
};