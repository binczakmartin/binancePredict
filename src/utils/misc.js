/*******************************************************************************
** miscelaneous functions
** BINCZAK Martin - 2023
*******************************************************************************/

export const getDateStr = function () {
  const date = new Date();
  const day = date.getDay() < 10 ? '0' + date.getDay() : date.getDay();
  const month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth();

  return `${day}-${month}-${date.getFullYear()}`;
}

export const generateRandom = function (min = 0, max = 100) {
  let difference = max - min;
  let rand = Math.random();

  rand = Math.floor(rand * difference);
  rand = rand + min;
  return rand;
}