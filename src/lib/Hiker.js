const async = require('async');
const Wallet = require('../models/Wallet');

class Hiker {
    constructor(sourceCoin, coins, destCoins) {
        this.sourceCoin = sourceCoin;
        this.destCoins = destCoins || sourceCoin;
        this.coins = coins;

        this.sourceWallet = new Wallet(sourceCoin, Hiker.initialBalance);

        this.paths = [];
        this.minBalance = Infinity;
        this.minPath = "";
        this.maxBalance = 0;
        this.maxPath = "";
    }
    static get initialBalance() {
        return 100;
    }

    displayMaxima() {
        const maxLength = this.maxPath.split('_').length;
        const minLength = this.minPath.split('_').length;
        if(maxLength > 2) {
            console.log(`Max: ${this.maxBalance} ${this.maxPath}`);
        }
        if(minLength > 2) {
            console.log(`Min: ${this.minBalance} ${this.minPath}`);
        }
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

                acc.push(nextWallet);
                nextWallet.convertToCoin(destinationCoin);

                if(nextWallet.coin === this.destCoins) {

                    this.storePath(nextWallet);

                }

            }

            return acc;

        }, []);

    }

    hike() {
        // console.log("hiking " + this.sourceCoin.symbol + "...");

        this.repeatLayer([this.sourceWallet]);
        this.displayMaxima();
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