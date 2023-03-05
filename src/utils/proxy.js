/*******************************************************************************
** Proxy function
** BINCZAK Martin - 2023
*******************************************************************************/

import fs from 'fs';

export const getProxies = function() {
  const content = fs.readFileSync('./proxy/proxy.txt', {encoding: "utf8"});
  console.log('content', content)

  if (!content) return [];

  return content.split('\n').map((elem) => {
    const tab = elem.split(':');
  
    return {
      protocol: 'http',
      host: tab[0],
      port: tab[1]
    }
  })
}

