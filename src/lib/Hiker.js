const async = require('async');
const Wallet = require('../models/Wallet');

class Hiker {
    constructor(sourceCoin, coins) {
        this.sourceCoin = sourceCoin;
        this.coins = coins;

        this.sourceWallet = new Wallet(sourceCoin, Hiker.initialBalance);

        this.paths = [];
        this.minBalance = Infinity;
        this.maxBalance = 0;
    }
    static get initialBalance() {
        return 100;
    }

    displayMaxima() {

        console.log(Hiker.getWalletPath(wallet) + "|---->");
        console.log("MIN :" + this.minBalance + " " + wallet.coin.symbol);
        console.log("MAX :" + this.maxBalance + " " + wallet.coin.symbol);
        console.log("");
    }
    storePath(wallet) {
        this.paths = this.paths.concat(wallet);

        if(wallet.balance > this.maxBalance) {
            this.maxBalance = wallet.balance;
            console.log(Hiker.getWalletPath(wallet) + "|---->");
            console.log("MAX :" + wallet.balance + " " + wallet.coin.symbol);
            console.log("");
        }
        if(wallet.balance < this.minBalance) {
            this.minBalance = wallet.balance;
            console.log(Hiker.getWalletPath(wallet) + "|---->");
            console.log("MIN :" + wallet.balance + " " + wallet.coin.symbol);
            console.log("");
        }

        /*console.log(Hiker.getWalletPath(wallet) + "|---->");
        console.log(wallet.coin.symbol + " " + wallet.balance);
        console.log("");*/
    }
    repeat(currentWallet) {
        async.eachSeries(this.coins, (destinationCoin, callback) => {
            async.nextTick(() => {
                if(destinationCoin === currentWallet.coin) {
                    return callback(null);
                }
                let nextWallet = new Wallet(currentWallet);
                if(nextWallet.height > 3) {
                    return callback(null);
                }
                nextWallet.convertToCoin(destinationCoin);

                if(nextWallet.coin === this.sourceCoin) {
                    this.storePath(nextWallet);
                } else {
                    this.repeat(nextWallet);
                }
                callback(null);
            });
        }, e => {
            if(e) {
                throw e;
            }
        })
    }

    hike() {
        console.log("hiking " + this.sourceCoin.symbol + "...");

        this.repeat(this.sourceWallet);

    }

    static getWalletPath(wallet) {
        let str = wallet.coin.symbol + ' <- ';
        let parentWallet = wallet.parent;
        while(parentWallet) {
            str += parentWallet.coin.symbol + ' <- ';
            parentWallet = parentWallet.parent;
        }
        return str;
    }
}

module.exports = Hiker;