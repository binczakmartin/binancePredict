/*******************************************************************************
** entry point
** BINCZAK Martin - 2023
*******************************************************************************/

import argsParser from 'args-parser';
import { title } from './src/utils/ui.js';
import { getAllKlines } from './src/binance/getKlines.js';

const parsearguments = async function () {
    const args = argsParser(process.argv);
    console.log('args => ', args);
    
    if (args['g']) {
        await getAllKlines();
    } else {
        console.log('help');
    }
}


title(); 
parsearguments();