require('babel-polyfill');

const Coins = require('./models/Coins');
const Army = require('./lib/Army');
const API = require('./lib/Api');
const Hiker = require('./lib/Hiker');
const Elephant = require('./models/Elephant');

const refreshInterval = 30000;

async function coinRefresher() {
    await Coins.initCoins();
    await Coins.updateLinks();
    console.log("Coins updated");
}
function test() {

    const lookForAll = () => {
        console.log("looking ForAll");

        Army.forSameCoins();
        Army.forCoinCombinations();
    };

    // Army.hikeLink('DGB', 'BTC');
    Army.hikePath('DGB_BTC');
    Army.hikePath('DGB_USDT_BTC');
    Army.hikePath('DGB_BTC_DGB_USDT_BTC');
    Army.hikePath('DGB_USDT_BTC_DGB');
    // lookForAll();

    console.log(Elephant.getSortedPaths('DGB', 'BTC'));
    console.log("end");
}

async function app() {

    await coinRefresher();

    setInterval(coinRefresher, refreshInterval);

    API();
    // test();
}

try {
    app();
} catch(e) {
    console.error(e);
}
