const Coins = require('./models/Coins');
const Robert = require('./lib/Robert');
const Hiker = require('./lib/Hiker');

async function app() {
    await Coins.initCoins();
    await Coins.updateLinks();

    const lookForCouple = (sourceSymbol, destSymbol) => {
        console.log("looking ForCouple");
        const sourceCoin = Coins.getCoin(sourceSymbol);
        const destCoin = Coins.getCoin(destSymbol);

        const hiker = new Hiker(sourceCoin, destCoin);
        hiker.findAllPaths();
    };

    const lookForPath = (path) => {
        // console.log("looking ForPath");
        let pathArray = path.split("_");

        const sourceCoin = Coins.getCoin(pathArray[0]);
        const destCoin = Coins.getCoin(pathArray[pathArray.length-1]);

        const hiker = new Hiker(sourceCoin, destCoin);
        hiker.computePath(path);
    };

    const lookForAll = () => {
        console.log("looking ForAll");
        const robert = new Robert();

        robert.forSameCoins();
        robert.forCoinCombinations();
    };

    // lookForCouple('DGB', 'BTC');
    lookForPath('DGB_BTC');
    lookForPath('DGB_USDT_BTC');
    lookForPath('BTC_DGB_USDT_BTC');
    // lookForAll();

    console.log("end");
}

try {
    app();
} catch(e) {
    console.error(e);
}

process.on('unhandledRejection', (reason, promise) => console.error(reason));
