const Coins = require('./models/Coins');
const Robert = require('./lib/Robert');
const Hiker = require('./lib/Hiker');

async function app() {
    await Coins.initCoins();
    await Coins.updateLinks();

    const coins = Coins.getCoins();

    const lookForCouple = (sourceSymbol, destSymbol) => {
        console.log("looking ForCouple");
        const sourceCoin = Coins.getCoin(sourceSymbol);
        const destCoin = Coins.getCoin(destSymbol);

        const hiker = new Hiker(sourceCoin, coins, destCoin);
        hiker.hike();
    };

    const lookForAll = () => {
        console.log("looking ForAll");
        const robert = new Robert(coins);

        robert.forSameCoins();
        robert.forCoinCombinations();
    };

    // lookForCouple('DGB', 'BTC');
    lookForAll();

    console.log("end");
}

try {
    app();
} catch(e) {
    console.error(e);
}

process.on('unhandledRejection', (reason, promise) => console.error(reason));
