/*******************************************************************************
** miscelaneous functions
** BINCZAK Martin - 2023
*******************************************************************************/

export const resizeArrays = function(arrays, array) {
  let smallestSize = Math.min(...arrays.map(array => array.length));

  if (array.length < smallestSize) {
    smallestSize = array.length;
  }

  for (let i = 0; i < arrays.length; i++) {
    if (arrays[i].length > smallestSize) {
      arrays[i].splice(smallestSize, arrays[i].length - smallestSize);
    }
  }

  if (array.length > smallestSize) {
    array.splice(smallestSize, array.length - smallestSize);
  }

  return { features: arrays, labels: array };
}

export const generateRandom = function (min = 0, max = 100) {
  let difference = max - min;
  let rand = Math.random();

  rand = Math.floor(rand * difference);
  rand = rand + min;
  return rand;
}