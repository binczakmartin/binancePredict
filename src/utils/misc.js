/*******************************************************************************
** Miscelneaous Functions
** BINCZAK Martin - 2023
*******************************************************************************/

import fs from 'fs';
import { join } from "path";

export const deletePathContents = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  fs.readdirSync(dirPath).forEach((file) => {
    const curPath = join(dirPath, file);
    if (fs.lstatSync(curPath).isDirectory()) {
      deletePathContents(curPath);
      fs.rmdirSync(curPath);
    } else {
      fs.unlinkSync(curPath);
    }
  });
};