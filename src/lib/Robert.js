const Hiker = require('./Hiker');
const Coins = require('../models/Coins');

const coins = Coins.getCoins();
class Robert {
    constructor() {
        this.coins = Coins.getCoins();
    }

    hike(fromCoin, toCoin) {
        const hiker = new Hiker(fromCoin, toCoin);
        hiker.findAllPaths();
    }
    forSameCoins() {
        this.coins.forEach(fromCoin => {
            let toCoin = fromCoin;
            this.hike(fromCoin, toCoin);
        });
    }
    forCoinCombinations() {
        this.coins.forEach(fromCoin => {
            this.coins.forEach(toCoin => {
                if(fromCoin !== toCoin) {
                    this.hike(fromCoin, toCoin);
                }
            })
        })
    }
}

module.exports = Robert;