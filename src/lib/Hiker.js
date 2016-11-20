const async = require('async');
const Wallet = require('../models/Wallet');

class Hiker {
    constructor(sourceCoin, coins, destCoin) {
        this.sourceCoin = sourceCoin;
        this.destCoin = destCoin || sourceCoin;
        this.coins = coins;

        this.sourceWallet = new Wallet(this.sourceCoin, Hiker.initialBalance);

        this.paths = [];

        let maxWallet = new Wallet(this.sourceWallet);
        maxWallet.convertToCoin(this.destCoin);
        let maxPath = this.sourceCoin.symbol + '_' + this.destCoin.symbol;

        this.initMaxBalance = maxWallet.balance;
        this.minBalance = maxWallet.balance;
        this.minPath = maxPath;
        this.maxBalance = maxWallet.balance;
        this.maxPath = maxPath;
    }
    static get initialBalance() {
        return 100;
    }

    displayMaxima() {
        console.log(`Basic: ${this.sourceWallet.balance} ${this.sourceCoin.symbol} -> ${this.initMaxBalance} ${this.destCoin.symbol}`);
        console.log(`Max: ${this.maxBalance} ${this.maxPath}`);
        console.log(`Min: ${this.minBalance} ${this.minPath}`);
    }
    storePath(wallet) {
        this.paths = this.paths.concat(wallet);

        if(wallet.balance > this.maxBalance) {
            this.maxBalance = wallet.balance;
            this.maxPath = Hiker.getWalletPath(wallet);
        }
        if(wallet.balance < this.minBalance) {
            this.minBalance = wallet.balance;
            this.minPath = Hiker.getWalletPath(wallet);
        }
    }

    repeatLayer(layerWallets){

        const actualHeight = layerWallets[0].height;

        if(actualHeight < 3){
            // console.log(`Computing layer ${actualHeight}, with ${layerWallets.length} coins`);

            this.repeatLayer(layerWallets.map( (wallet) => this.repeat(wallet) ).reduce((a,b) => a.concat(b), []));

        }

    }

    repeat(currentWallet) {

        return this.coins.reduce( (acc, destinationCoin) => {

            if(destinationCoin !== currentWallet.coin) {

                let nextWallet = new Wallet(currentWallet);
                nextWallet.convertToCoin(destinationCoin);

                acc.push(nextWallet);

                if(nextWallet.coin === this.destCoin) {
                    this.storePath(nextWallet);
                }
            }

            return acc;

        }, []);

    }

    hike() {
        // console.log("");
        // console.log("Computing "+ this.sourceCoin.symbol + "_" + this.destCoin.symbol);

        this.repeatLayer([this.sourceWallet]);
        if(this.isUncommon()) {
            console.log("                   UNCOMMON            !!!!!!!!!!!!!");
            this.displayMaxima();
        }
    }

    isUncommon() {
        const maxLength = this.maxPath.split('_').length;
        const minLength = this.minPath.split('_').length;

        if(maxLength > 2 || minLength === 2 || this.maxBalance > this.initMaxBalance) {
            return true;
        }
        return false;
    }

    static getWalletPath(wallet) {
        let path = [wallet.coin.symbol];
        let parentWallet = wallet.parent;
        while(parentWallet) {
            path = path.concat(parentWallet.coin.symbol);
            parentWallet = parentWallet.parent;
        }
        path = path.reverse();
        return path.join('_');
    }
}

module.exports = Hiker;