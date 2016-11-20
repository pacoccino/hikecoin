const Coins = require('./models/Coins');
const Hiker = require('./lib/Hiker');

async function app() {
    await Coins.initCoins();
    await Coins.updateLinks();

    const coins = Coins.getCoins();
    const sourceCoin = Coins.getCoin('EMC');
    const hiker = new Hiker(sourceCoin, coins);
    hiker.hike();
}

try {
    app();
} catch(e) {
    console.error(e);
}

process.on('unhandledRejection', (reason, promise) => console.error(reason));
