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
  const trainSize = Math.floor(dataset.length * 0.75);

  const X_train = tf.tensor2d(dataset.slice(0, trainSize).map(row => row.slice(1, 6)));
  const Y_train = tf.tensor1d(dataset.slice(0, trainSize).map(row => row[4]));
  const X_test = tf.tensor2d(dataset.slice(trainSize).map(row => row.slice(1, 6)));
  const Y_test = tf.tensor1d(dataset.slice(trainSize).map(row => row[4]));
  
  const model = await loadModel(pair);

  const earlyStop = tf.callbacks.earlyStopping({
    monitor: 'val_loss',
    patience: 75,
    restoreBestModel: true,
  });

  // Train model with early stopping
  const history = await tf.profile(() => model.fit(X_train, Y_train, {
    epochs: 150,
    batchSize: 2048, // Increase batch size for parallelism
    validationData: [X_test, Y_test],
    callbacks: [earlyStop],
    verbose: 1, // Print training progress
  }));

  await X_train.dispose();
  await Y_train.dispose();
  
  // Evaluate the model
  const loss = model.evaluate(X_test, Y_test);
  console.log(`Test loss: ${loss}`);

  await X_test.dispose();
  await Y_test.dispose();

  await model.save(`file://${resolve(savedModelPath)}/${pair}`);
};
