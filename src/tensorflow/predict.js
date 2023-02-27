/*******************************************************************************
** Predict future close price
** BINCZAK Martin - 2023
*******************************************************************************/

// Import required libraries
const tf = require('@tensorflow/tfjs');

// Generate training data
const generateData = (numSamples) => {
  const data = [];
  for (let i = 0; i < numSamples; i++) {
    const open = Math.random() * 100;
    const close = Math.random() * 100;
    const volume = Math.random() * 1000000;
    const high = Math.random() * 100;
    const low = Math.random() * 100;
    const nextDayClose = Math.random() * 100;
    data.push([open, close, volume, high, low, nextDayClose]);
  }
  return data;
}

const data = generateData(1000);

// Prepare data for model training
const xs = tf.tensor2d(data.map(row => row.slice(0, 5)));
const ys = tf.tensor2d(data.map(row => [row[5]]));

// Define model architecture
const model = tf.sequential();
model.add(tf.layers.dense({ units: 32, inputShape: [5], activation: 'relu' }));
model.add(tf.layers.dense({ units: 1, activation: 'linear' }));

// Compile model
model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

// Train model
model.fit(xs, ys, {
  epochs: 100,
  validationSplit: 0.2,
  shuffle: true,
}).then(history => {
  console.log(history);
});
