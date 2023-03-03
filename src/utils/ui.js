/*******************************************************************************
** display functions
** BINCZAK Martin - 2023
*******************************************************************************/

export const title = function() {
  const text = "\x1b[38;5;178mBINANCE PREDICT V1\x1b[0m\n\n___\n"

  console.clear();
  console.log(text);
};