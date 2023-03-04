/*******************************************************************************
** miscelaneous functions
** BINCZAK Martin - 2023
*******************************************************************************/

export const generateRandom = function (min = 0, max = 100) {
  let difference = max - min;
  let rand = Math.random();

  rand = Math.floor(rand * difference);
  rand = rand + min;
  return rand;
}