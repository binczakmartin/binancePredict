/*******************************************************************************
** Train the model
** BINCZAK Martin - 2023
*******************************************************************************/

// Make predictions on new data
const newValues = [[100, 102, 1000000, 105, 98], [110, 112, 1200000, 115, 108]];
const newTensor = tf.tensor2d(newValues);
const predictions = model.predict(newTensor);

// Print predictions
predictions.dataSync().forEach(prediction => console.log(prediction));