/*******************************************************************************
** Train the model
** BINCZAK Martin - 2023
*******************************************************************************/

import tf from "@tensorflow/tfjs-node";
import { intervals } from "../constants";

export const predictNextClose = async function (date, pair) {
  const model = await loadModel();
  const features = [];

  intervals.map((interval) => features.push(getFeatures(pair, date, interval)));

  const normalizedArrays = resizeArrays(features);
  const tensors = normalizedArrays.features.map(f => tf.tensor2d(f, [f.length, f[0].length]));
  const concatenated = tf.layers.concatenate().apply(tensors);
  const prediction = model.predict(concatenated);
  const output = prediction.dataSync()[0];

  return output;
};