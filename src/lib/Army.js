const amqp = require('amqplib/callback_api');

const config = require('../config.json');
const Hiker = require('./Hiker');
const Coins = require('../models/Coins');

const addToQueue = async (task, payload) => {
    return new Promise((resolve, reject) => {

        console.log("amqp connecting");
        amqp.connect(config.amqUrl, (err, conn) => {
            if (err) {
                console.error(err);
                return process.exit(1);
            }

            conn.createChannel((channelErr, ch) => {
                if (channelErr) {
                    console.error(channelErr);
                    return process.exit(1);
                }

                console.log('connected');

                var workMsg = {
                    task,
                    payload
                };

                ch.assertQueue('work', {autoDelete: false, durable: true});
                ch.sendToQueue(
                    'work',
                    new Buffer(JSON.stringify(workMsg))
                );

                ch.close(() => {
                    // conn.close();
                    resolve(workMsg);
                });
            });
        });
    });
};

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
        return addToQueue('hikePath', {path});
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
}

module.exports = Army;