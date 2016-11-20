const Hiker = require('./Hiker');

class Robert {
    constructor(coins) {
        this.coins = coins;
    }

    hike(fromCoin, toCoin) {
        const hiker = new Hiker(fromCoin, this.coins, toCoin);
        hiker.hike();
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