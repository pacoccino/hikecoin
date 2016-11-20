const Hiker = require('./Hiker');

class Robert {
    constructor() {
    }

    static forEachCoins(coins) {
        coins.forEach(fromCoin => {
            coins.forEach(toCoin => {
                console.log("");
                console.log("Computing "+ fromCoin.symbol + "_" + toCoin.symbol);
                const hiker = new Hiker(fromCoin, coins, toCoin);
                hiker.hike();
            })
        })
    }
}

module.exports = Robert;