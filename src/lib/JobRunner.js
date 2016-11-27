// const amqp = require('amqplib/callback_api');
const async = require('async');

const config = require('../../config.json');
const Hiker = require('./Hiker');
const Coins = require('../models/Coins');


class Army {
    static async hikeCoin(coin) {
        const hiker = new Hiker();
        hiker.setPath({sourceCoin: coin});
        return hiker.findAllPaths();
    }

    static async hikeLink(fromCoin, toCoin) {
        const hiker = new Hiker();
        hiker.setPath({sourceCoin: fromCoin, destCoin: toCoin});
        return hiker.findAllPaths();
    }
    static async hikePath(path) {
        const hiker = new Hiker();
        hiker.setPath({path});
        return hiker.hikePath();
    }
    static async forSameCoins() {
        const coins = Coins.getCoins();
        coins.forEach(coin => {
            Army.hikeCoin(coin.symbol);
        });
    }
    static async forCoinCombinations() {
        const coins = Coins.getCoins();
        coins.forEach(fromCoin => {
            coins.forEach(toCoin => {
                if(fromCoin !== toCoin) {
                    Army.hikeLink(fromCoin.symbol, toCoin.symbol);
                }
            })
        })
    }
    static async forAll() {
        return new Promise((resolve, reject) => {
            const coins = Coins.getCoins();

            const compute = couple => {
                return Army.hikeLink(couple.fromCoin.symbol, couple.toCoin.symbol);
            };
            const combinationsToCompute = [];
            coins.forEach(fromCoin => {
                coins.forEach(toCoin => {
                    combinationsToCompute.push({fromCoin, toCoin});
                })
            });

            async.eachSeries(combinationsToCompute, (couple, cb) => {
                // Timeout to let some others computations
                setTimeout(() => {
                    compute(couple).then(() => {
                        cb();
                    }).catch(cb);
                }, 50);
            }, e => {
                if(e) reject(e);
                else resolve();
            });
        });
    }
}

module.exports = Army;