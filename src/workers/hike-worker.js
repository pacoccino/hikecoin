const amqp = require('amqplib/callback_api');

const config = require('../../config.json');
const JobRunner = require('../lib/JobRunner');
const Coins = require('../models/Coins');
const Elephant = require('../models/Elephant');

let isWorking = false;

const listen = (channel) => {

    channel.assertQueue('work');
    channel.consume(
        'work',
        (msg) =>{
            if(isWorking) {
                // console.log("Already working")
                channel.nack(msg);
                return;
            }
            if (msg !== null) {
                var work = JSON.parse(msg.content.toString());

                console.log("work received", work);
                const task = work.task;
                const payload = work.payload;

                isWorking = true;
                switch(task) {
                    case 'hikeLink':
                        JobRunner.hikeLink(payload.fromCoin, payload.toCoin)
                            .then(() => {
                                console.log(`HikeLink done. Elephant size ${Elephant.size}`);
                                isWorking = false;
                                channel.ack(msg);
                            })
                            .catch(e => {
                                console.error(e);
                                channel.nack(msg);
                            });
                        break;
                    default:
                        isWorking = false;
                        channel.nack(msg);
                }
            }
        });
};

const worker = async () => {
    console.log("amqp connecting");

    await Coins.initCoins();
    await Coins.updateLinks();

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

            listen(ch);
        });
    });
};

const randomWorker = async () => {

    await Coins.initCoins();
    await Coins.updateLinks();


    const coins = Coins.getCoins();
    let randomIndex = Math.floor(Math.random()*coins.length);
    const coinToFetch = coins[randomIndex];
    JobRunner.hikeCoin(coinToFetch.symbol)
        .then(() => Elephant.listBestPaths(10, true))
        .then(console.log)
        .then(() => {
            console.log(Elephant.size)
        });
};

module.exports = worker;