/*******************************************************************************
** Predict future close price
** BINCZAK Martin - 2023
*******************************************************************************/

import * as tf from '@tensorflow/tfjs-node';
import { resolve } from 'path';
import { loadModel } from './model.js';
import { savedModelPath } from '../constants.js';
import { getFeatures } from '../utils/transform.js';

export const trainModel = async (date, pair) => {
  tf.enableProdMode();
  tf.setBackend('tensorflow');

  const dataset = getFeatures(pair, date, '1h');
  
  const trainSize = Math.floor(dataset.length * 0.9);
  const X_train = tf.tensor2d(dataset.slice(0, trainSize).map(row => row.slice(1, 6))); // select only the open, high, low, and close values
  const y_train = tf.tensor1d(dataset.slice(0, trainSize).map(row => row[4])); // select the closing price as the target variable
  const X_test = tf.tensor2d(dataset.slice(trainSize).map(row => row.slice(1, 6)));
  const y_test = tf.tensor1d(dataset.slice(trainSize).map(row => row[4]));
  
  const model = await loadModel(pair);

  const earlyStop = tf.callbacks.earlyStopping({
    monitor: 'val_loss',
    patience: 50,
    restoreBestModel: true,
  });

  // Train model with early stopping
  const history = await tf.profile(() => model.fit(X_train, y_train, {
    epochs: 250,
    batchSize: 100, // Increase batch size for parallelism
    validationData: [X_test, y_test],
    callbacks: [earlyStop],
    verbose: 1, // Print training progress
  }));

  console.log("test1")
  // Evaluate the model
  const loss = model.evaluate(X_test, y_test);
  console.log(`Test loss: ${loss}`);

  await model.save(`file://${resolve(savedModelPath)}/${pair}`);
};
