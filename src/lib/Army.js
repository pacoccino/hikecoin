const amqp = require('amqplib/callback_api');

const config = require('../../config.json');
const Coins = require('../models/Coins');

let channel = null;

const addToQueue = async (task, payload) => {
    return new Promise((resolve, reject) => {
        if(!channel) return reject("Please connect amq");

        var workMsg = {
            task,
            payload
        };

        channel.assertQueue('work', {autoDelete: false, durable: true});
        channel.sendToQueue(
            'work',
            new Buffer(JSON.stringify(workMsg))
        );
    });
};

class Army {
    static async connect() {
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

                    channel = ch;
                    resolve(channel);
                });
            });
        });
    }
    static async work() {
        const coins = Coins.getCoins();

        const askCompute = couple => {
            return Army.hikeLink(couple.fromCoin.symbol, couple.toCoin.symbol);
        };

        let combinations = [];
        coins.forEach(fromCoin => {
            coins.forEach(toCoin => {
                combinations.push({fromCoin, toCoin});
            })
        });

        combinations = combinations.map(askCompute);

        return Promise.all(combinations);
    }

    static async hikeLink(fromCoin, toCoin) {
        return addToQueue('hikeLink', {fromCoin, toCoin});
    }
}

module.exports = Army;