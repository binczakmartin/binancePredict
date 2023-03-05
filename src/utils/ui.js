/*******************************************************************************
** display functions
** BINCZAK Martin - 2023
*******************************************************************************/

export const printAsciiArt = function() {
  console.clear();
  console.log(`\n\x1b[38;5;178m   O~~ O~~                                                              O~       O~~
   O~    O~~  O~                                                       O~ ~~     O~~
   O~     O~~   O~~ O~~     O~~    O~~ O~~     O~~~   O~~             O~  O~~    O~~
   O~~~ O~   O~~ O~~  O~~ O~~  O~~  O~~  O~~ O~~    O~   O~~         O~~   O~~   O~~
   O~     O~~O~~ O~~  O~~O~~   O~~  O~~  O~~O~~    O~~~~~ O~~       O~~~~~~ O~~  O~~
   O~      O~O~~ O~~  O~~O~~   O~~  O~~  O~~ O~~   O~              O~~       O~~ O~~
   O~~~~ O~~ O~~O~~~  O~~  O~~ O~~~O~~~  O~~   O~~~  O~~~~        O~~         O~~O~~\x1b[0m\n\n`);
}

export const help = function() {
  console.log('Usage: node index.js [options]\n');
  console.log('Options:\n');
  console.log('  fetch        Download and save Binance data to data folder');
  console.log('  train        Train TensorFlow model for all trading pairs');
  console.log('  predict      Predict crypto price with the trained model...');
  console.log('  delete       Delete the trained model');
  console.log('\n');
}