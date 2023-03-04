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
  console.log('Usage: node index.js [options]');
  console.log('Options:');
  console.log('  -g          Download and save Binance data to data folder');
  console.log('  -t          Train TensorFlow model for all trading pairs');
  console.log('\n\n');
}