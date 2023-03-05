/*******************************************************************************
** Transform data for tensorflow
** BINCZAK Martin - 2023
*******************************************************************************/

import fs from "fs";

export const getFeatures = function (pair, date, interval) {
  const features = [];
  const filePath = `./data/${date}/${pair}/${interval}/kline.json`;

  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath));
    data.map((elem) => features.push([...elem].map((x) => parseFloat(x, 10))));
    return features;
  }

  return features;
};

export const getLabels = function (pair, date, interval) {
  const labels = [];
  const filePath = `./data/${date}/${pair}/${interval}/kline.json`;

  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath));
    for (let i = 0; i < data.length - 1; i++) {
      labels.push(parseFloat(data[i + 1][1]));
    }
    return labels;
  }

  return labels;
};

export const resizeArrays = function (arrays, array) {
  let smallestSize = Math.min(...arrays.map(array => array.length));

  if (array && array.length < smallestSize) {
    smallestSize = array.length;
  }

  for (let i = 0; i < arrays.length; i++) {
    if (arrays[i].length > smallestSize) {
      arrays[i].splice(smallestSize, arrays[i].length - smallestSize);
    }
  }

  if (array && array.length > smallestSize) {
    array.splice(smallestSize, array.length - smallestSize);
  }

  return { features: arrays, labels: array };
}