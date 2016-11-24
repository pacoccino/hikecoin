const Coin = require('./Coin');
const ShapeShift = require('../lib/ShapeShift');
const async = require('async');

class Coins {
    constructor() {
        this.coins = new Map();
    }

    addCoin(coin) {
        this.coins.set(coin.symbol, coin);
    }
    getCoin(symbol) {
        return this.coins.get(symbol);
    }
    getCoins() {
        return Array.from(this.coins).map(kv => kv[1]);
    }

    async initCoins() {
        const availableCoins = await ShapeShift.getCoins();

        Object.keys(availableCoins).forEach(key => {
            const info = availableCoins[key];
            const coin = new Coin(info);

            if(coin.avalaible) {
                this.addCoin(coin);
            }
        });

        // console.log("Found " + this.coins.size + " coins");
    }

    static async getRate(coinSource, coinDest) {
        const symbolpair = coinSource.symbol + '_' + coinDest.symbol;
        return await ShapeShift.marketInfo(symbolpair);
    }
    static async updateLink(coinSource, coinDest) {
        const rate = await Coins.getRate(coinSource, coinDest);
        return coinSource.updateRate(coinDest, rate);
    }

    updateLinks_oneByOne() {
        return new Promise((resolve, reject) => {
            console.log("Updating links...");

            const coins = this.getCoins();
            async.eachLimit(coins, 10, (sourceCoin, sourceCb) => {
                async.eachLimit(coins, 1, (destinationCoin, destCb) => {
                    if(sourceCoin === destinationCoin) return destCb();

                    Coins.updateLink(sourceCoin, destinationCoin)
                        .then(destCb);
                }, e => {
                    sourceCb(e);
                });
            }, e => {
                console.log("updateLinks finished");
                if(e) {
                    reject(e);
                } else {
                    resolve();
                }
            });
        });
    }

    async updateLinks() {
        const allLinks = await ShapeShift.marketInfo();

        allLinks.map(link => {
            let symbols = link.pair.split('_');

            let sourceCoin = this.getCoin(symbols[0]);
            let destCoin = this.getCoin(symbols[1]);

            if(!sourceCoin || !destCoin) {
                return null;
            }
            sourceCoin.updateRate(destCoin, link);
            return null;
        });
    }
}

const coinInstance = new Coins();

module.exports = coinInstance;