require('babel-polyfill');

const Coins = require('./models/Coins');
const Army = require('./lib/Army');
const API = require('./lib/Api');
const Hiker = require('./lib/Hiker');
const Elephant = require('./models/Elephant');

async function coinRefresher() {
    await Coins.initCoins();
    await Coins.updateLinks();
    setTimeout(coinRefresher, 30 * 1000);
    console.log("Coins updated");
}
async function linkRefresher() {
    console.log("Updating links...");

    let start = Date.now();
    await Army.forAll();
    let time = Date.now() - start;
    // Elephant.write();
    setTimeout(linkRefresher, 30 * 60 * 1000);
    console.log(`Links updated,  took ${time/1000}s`);
}

function test() {

    const lookForAll = () => {
        console.log("looking ForAll");

        Army.forSameCoins();
        Army.forCoinCombinations();
        console.log("end lookForAll");
    };

    // Army.hikeLink('DGB', 'BTC');
    // Army.hikePath('DGB_BTC');
    // Army.hikePath('DGB_USDT_BTC');
    // Army.hikePath('DGB_BTC_DGB_USDT_BTC');
    // Army.hikePath('DGB_USDT_BTC_DGB');

    Army.hikePath('DOGE_USDT_BTC');
    const report = Army.hikePath('DGB_USDT_BTC').then(report => {
        console.log(`${report.sourceBalance} ${report.sourceCoin} -> ${report.finalBalance} ${report.finalCoin} -  ${report.path}`);
    });
    Elephant.write();

    // Army.hikeLink('DGB', 'BTC');
    // lookForAll();

    // console.log(Elephant.getSortedPaths('DGB', 'BTC'));
}

async function app() {

    await coinRefresher();

    API();

    coinRefresher();
    linkRefresher();
    // test();
}

try {
    app();
} catch(e) {
    console.error(e);
}
