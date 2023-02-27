
/*******************************************************************************
** Get Binance Klines data
** BINCZAK Martin - 2023
*******************************************************************************/

const axios = require('axios');

/* get only USDT pairs */
const quoteAsset = [ "USDT" ];

/* time intervals 1m, 5m, 15m, 30m, 1h ...  */
const intervals = ["5m"];

module.exports = {

    /* get markets data list */
    async getMarkets() {
        return new Promise(async (resolve, reject) => {
            let data = [];
            try {
                const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr', {
                    timeout: 40000
                });
                for (var i = 0; i < response.data.length; i++) {
                    for (var q of quoteAsset) {
                        if (response.data[i].symbol.endsWith(q)) {
                            data.push(response.data[i]);
                        }
                    }
                }
                data = data.sort(function(a,b) {return b.quoteVolume - a.quoteVolume});
                resolve(data);
            } catch (e) {
                reject(e);
            }
        })
    },

    /* get all interval candlestick data by pair */
    async getKlines(symbol) {
        return new Promise(async (resolve, reject) => {
            try {
                dataObj[symbol] = {};
                for (var interval of intervals) {
                    const response = await axios.get('https://api.binance.com/api/v3/klines', {
                        timeout: 40000,
                        params: { 
                            'symbol': symbol,
                            'interval': interval
                        }
                    });
                    // sleep to reduce call weight and avoid ban
                    await new Promise(resolve => setTimeout(resolve, 30));
                    if (response.headers['x-mbx-used-weight-1m'] > 850) {
                        await new Promise(resolve => setTimeout(resolve, 60000));
                    }
                    dataObj[symbol][interval] = response.data;
                }
                resolve(dataObj[symbol])
            } catch (e) {
                reject(e);
            }
        })
    },
    
    /* get the data for all the pairs by chunks */
    async getAllKlines() {
        return new Promise(async (resolve, reject) => {
            try {
                let pTab = [];
                let data = await module.exports.getMarkets();
                const length = Math.floor(data.length/2); // only top volume for the moment to avoid ban
                data = data.slice(0,length);
                dataObj = {}
                for (elem of data) {
                    pTab.push(module.exports.getKlines(elem.symbol));
                    if (pTab.length % 20 == 0) { // avoid ban only chunks of 20
                        await Promise.all(pTab);
                        await new Promise(resolve => setTimeout(resolve, 2600));
                        pTab = [];
                    }
                }
                await Promise.all(pTab);
                resolve(dataObj);
            } catch(e) {
                reject(e);
            }
        })
    },
}