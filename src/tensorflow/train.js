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
  console.log("training pair ", pair)
  const dataset = getFeatures(pair, date, '1h');
  
  const trainSize = Math.floor(dataset.length * 0.6);

  const X_train = tf.tensor2d(dataset.slice(0, trainSize).map(row => row.slice(1, 6)));
  const y_train = tf.tensor1d(dataset.slice(0, trainSize).map(row => row[4]));
  const X_test = tf.tensor2d(dataset.slice(trainSize).map(row => row.slice(1, 6)));
  const y_test = tf.tensor1d(dataset.slice(trainSize).map(row => row[4]));
  
  const model = await loadModel(pair);

  const earlyStop = tf.callbacks.earlyStopping({
    monitor: 'loss',
    patience: 5,
    restoreBestModel: true,
  });

  // Train model with early stopping
  const history = await tf.profile(() => model.fit(X_train, y_train, {
    epochs: 10,
    batchSize: 1024, // Increase batch size for parallelism
    validationData: [X_test, y_test],
    callbacks: [earlyStop],
    verbose: 1, // Print training progress
  }));

  // Evaluate the model
  const loss = model.evaluate(X_test, y_test);
  console.log(`Test loss: ${loss}`);

  await model.save(`file://${resolve(savedModelPath)}`);
};
