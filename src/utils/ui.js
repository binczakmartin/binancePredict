/*******************************************************************************
** display functions
** BINCZAK Martin - 2023
*******************************************************************************/

function generateRandom(min = 0, max = 100) {
    let difference = max - min;
    let rand = Math.random();

    rand = Math.floor( rand * difference);
    rand = rand + min;
    return rand;
}

export function generatePattern(lineNb, lineLength, colorNb) {
    const text = "BINANCE PREDICT V1"
    const clearColor = '\x1b[0m';
    // const charTab = ['░', '▒', '▓'];
    const charTab = ['▙', '▚', '▛', '▜', '▞', '▟'];

    let colorTab = ['\x1b[38;5;178m', '\x1b[38;5;241m'];
    let str = '';

    for(let i1 = 0; i1 < lineNb; i1++) {
        for(let i2 = 0; i2 < lineLength; i2++) {
            const color = colorTab[Math.floor(Math.random()*colorTab.length)];
            let char = charTab[Math.floor(Math.random()*charTab.length)];

            if (i1 == 0 && i2 == Math.floor(lineLength/2) - text.length) {
                str += `${colorTab[0]} ${text} ${clearColor}`;
                i2 += text.length;
            }
            else {
                str += color + char + clearColor;
            }
        }
        str += '\n';
    }
    
    return str;
}

export function title() {
    // let str = generatePattern(4, 85, 4);
    let str = generatePattern(1, 65, 2);

    console.clear();
    console.log(str);
};