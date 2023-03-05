/*******************************************************************************
** Predict future close price
** BINCZAK Martin - 2023
*******************************************************************************/

import tf from "@tensorflow/tfjs-node";
import fs from "fs";
import { resolve } from "path";
import { loadModel } from './model.js';
import { savedModelPath } from "../constants.js";
import { getFeatures } from "../utils/transform.js";

export const trainModel = async function (date, pair) {
  let model = await loadModel(pair);
  let dataset = getFeatures(pair, date, "1H");

  const trainSize = Math.floor(dataset.length * 0.8);
  const X_train = tf.tensor2d(dataset.slice(0, trainSize).map(row => row.slice(1, 6))); // select only the open, high, low, and close values
  const y_train = tf.tensor1d(dataset.slice(0, trainSize).map(row => row[4])); // select the closing price as the target variable
  const X_test = tf.tensor2d(dataset.slice(trainSize).map(row => row.slice(1, 6)));
  const y_test = tf.tensor1d(dataset.slice(trainSize).map(row => row[4]));

  // Define early stopping
  const earlyStop = tf.callbacks.earlyStopping({
    monitor: 'loss',
    patience: 10,
    restoreBestModel: true,
  });

  // Train model with early stopping
  const history = await model.fit(X_train, y_train, {
    epochs: 250,
    batch_size: 32,
    validation_data: [X_test, y_test],
    callbacks: [earlyStop] // Add early stopping callback
  });

  // Evaluate the model
  const loss = model.evaluate(X_test, y_test);
  await model.save(`file://${resolve(savedModelPath)}/${pair}`);
}
