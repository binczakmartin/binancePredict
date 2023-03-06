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
  console.log(`Usage: node index --stack-size=20000 [OPTIONS] COMMAND [ARGS]...

Commands:

  \x1b[38;5;11mfetch\x1b[0m    Download and save Binance data to data folder.

    -p     Use proxy connection.
  
  \x1b[38;5;11mtrain\x1b[0m    Train TensorFlow model for all trading pairs.
 
    -l     Number of loops for training. Default is 0.
  
  \x1b[38;5;11mpredict\x1b[0m  Predict crypto price with the trained model.
  
  \x1b[38;5;11mdelete\x1b[0m   Delete the trained model.

`);
}
