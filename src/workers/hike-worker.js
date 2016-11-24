const amqp = require('amqplib/callback_api');

const config = require('../../config.json');
const Hiker = require('../lib/Hiker');

let isWorking = false;

const hikePath = async (path) => {
    const hiker = new Hiker();
    hiker.setPath({path});
    return hiker.hikePath();
};

const listen = (channel) => {

    channel.assertQueue('work');
    channel.consume(
        'votes',
        (msg) =>{
            if (msg !== null) {
                var work = JSON.parse(msg.content.toString());

                console.log("work received", work);
                const task = work.task;
                const payload = work.payload;

                isWorking = true;
                switch(task) {
                    case 'hikePath':
                        hikePath(payload.path).then(report => {
                            isWorking = false;
                            channel.ack();
                        }).catch(e => {
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

const worker = () => {
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

            listen(ch);
        });
    });
};

module.exports = worker;