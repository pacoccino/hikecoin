require('babel-polyfill');

const Coins = require('./models/Coins');
const JobRunner = require('./lib/JobRunner');
const Army = require('./lib/Army');
const API = require('./lib/Api');
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
    await JobRunner.forAll();
    let time = Date.now() - start;
    setTimeout(linkRefresher, 30 * 60 * 1000);
    console.log(`Links updated,  took ${time/1000}s`);
}
async function armyLauncher() {
    await Army.work();
    setTimeout(armyLauncher, 30 * 60 * 1000);
}

function test() {

    const lookForAll = () => {
        console.log("looking ForAll");

        JobRunner.forSameCoins();
        JobRunner.forCoinCombinations();
        console.log("end lookForAll");
    };

    // JobRunner.hikeLink('DGB', 'BTC');
    // JobRunner.hikePath('DGB_BTC');
    // JobRunner.hikePath('DGB_USDT_BTC');
    // JobRunner.hikePath('DGB_BTC_DGB_USDT_BTC');
    // JobRunner.hikePath('DGB_USDT_BTC_DGB');

    JobRunner.hikePath('DOGE_USDT_BTC');
    const report = JobRunner.hikePath('DGB_USDT_BTC').then(report => {
        console.log(`${report.sourceBalance} ${report.sourceCoin} -> ${report.finalBalance} ${report.finalCoin} -  ${report.path}`);
    });
    Elephant.write();

    // JobRunner.hikeLink('DGB', 'BTC');
    // lookForAll();

    // console.log(Elephant.getSortedPaths('DGB', 'BTC'));
}

async function app() {

    await coinRefresher();
    await Army.connect();

    API();

    armyLauncher();
    linkRefresher();

    setInterval(() => console.log(Elephant.size), 3 * 1000);
    // test();
}

try {
    app();
} catch(e) {
    console.error(e);
}
