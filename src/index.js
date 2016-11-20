const Coins = require('./models/Coins');
const Robert = require('./lib/Robert');
const Hiker = require('./lib/Hiker');

async function app() {
    await Coins.initCoins();
    await Coins.updateLinks();

    const coins = Coins.getCoins();

    // const sourceCoin = Coins.getCoin('BTC');
    // const destCoin = Coins.getCoin('BCY');
    //
    // const hiker = new Hiker(sourceCoin, coins, destCoin);
    // hiker.hike();
    //
    Robert.forEachCoins(coins);
}

try {
    app();
} catch(e) {
    console.error(e);
}

process.on('unhandledRejection', (reason, promise) => console.error(reason));
