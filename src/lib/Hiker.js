const Coins = require('../models/Coins');
const Wallet = require('../models/Wallet');

class Hiker {
    constructor(sourceCoin, destCoin, maxHeight = 3) {
        this.sourceCoin = sourceCoin;
        this.destCoin = destCoin || sourceCoin;

        this.sourceWallet = new Wallet(this.sourceCoin, Hiker.initialBalance);

        this.paths = [];
        this.maxHeight = maxHeight;

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

    _displayMaxima() {
        console.log(`Basic: ${this.sourceWallet.balance} ${this.sourceCoin.symbol} -> ${this.initMaxBalance} ${this.destCoin.symbol}`);
        console.log(`Max: ${this.maxBalance} ${this.maxPath}`);
        console.log(`Min: ${this.minBalance} ${this.minPath}`);
    }
    _storePath(wallet) {
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

    _fetchLayer(layerWallets){
        const actualHeight = layerWallets[0].height;

        if(actualHeight < this.maxHeight){
            // console.log(`Computing layer ${actualHeight}, with ${layerWallets.length} coins`);

            const newLayers = layerWallets.map( wallet => this._fetchWallet(wallet) )
                .reduce((a,b) => a.concat(b), []);
            this._fetchLayer(newLayers);
        }
    }

    _fetchWallet(currentWallet) {

        return Coins.getCoins().reduce( (acc, destinationCoin) => {

            if(destinationCoin !== currentWallet.coin) {

                let nextWallet = new Wallet(currentWallet);
                nextWallet.convertToCoin(destinationCoin);

                acc.push(nextWallet);

                if(nextWallet.coin === this.destCoin) {
                    this._storePath(nextWallet);
                }
            }

            return acc;

        }, []);

    }

    findAllPaths() {
        // console.log("");
        // console.log("Computing "+ this.sourceCoin.symbol + "_" + this.destCoin.symbol);

        this._fetchLayer([this.sourceWallet]);
        if(this.isUncommon()) {
            console.log("                   UNCOMMON            !!!!!!!!!!!!!");
            this._displayMaxima();
        }
    }

    computePath(path) {
        path = path.split('_');
        let currentWallet = this.sourceWallet;

        for(let i=1; i< path.length; i++) {
            let newCoin = Coins.getCoin(path[i]);

            let newWallet = new Wallet(currentWallet);
            newWallet.convertToCoin(newCoin);

            currentWallet = newWallet;
        }
        this._storePath(currentWallet);
        console.log(`${this.sourceWallet.balance} ${this.sourceCoin.symbol} -> ${currentWallet.balance} ${this.destCoin.symbol} -  ${path}`);
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