const Coins = require('../models/Coins');
const Wallet = require('../models/Wallet');
const Elephant = require('../models/Elephant');

class Hiker {
    constructor(maxHeight = 3) {
        this.paths = [];
        this.maxHeight = maxHeight;
    }

    setPath(options = {sourceCoin: null, destCoin: null, path: null }) {
        if(!!options.path) {
            this.path = options.path.split("_");
            if(this.path.length < 2) throw "Invalid path";

            if(!this.sourceCoin && !this.destCoin) {
                this.sourceCoin = Coins.getCoin(this.path[0]);
                this.destCoin = Coins.getCoin(this.path[this.path.length - 1]);
            } else {
                if(this.sourceCoin !== Coins.getCoin(this.path[0]) || this.destCoin !== Coins.getCoin(this.path[this.path.length - 1])) {
                    throw "Requested path on hiker initialized on different input/ouput"
                }
            }
        } else {
            this.sourceCoin = Coins.getCoin(options.sourceCoin);
            this.destCoin = Coins.getCoin(options.destCoin || options.sourceCoin);
        }
        if(!this.sourceCoin || !this.destCoin) {
            throw "invalid source or dest coins";
        }

        this.sourceWallet = new Wallet(this.sourceCoin, Hiker.initialBalance);

        let directWallet = new Wallet(this.sourceWallet);
        directWallet.convertToCoin(this.destCoin);
        this.directResult = {
            path: Hiker.getCoinPath([this.sourceCoin, this.destCoin]),
            wallet: directWallet
        };

        this.minBalance = directWallet.balance;
        this.minPath = this.directResult.path;
        this.maxBalance = directWallet.balance;
        this.maxPath = this.directResult.path;
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
        const report = this.getReport(wallet);
        this.paths = this.paths.concat(report);

        if(wallet.balance > this.maxBalance) {
            this.maxReport = report;
            this.maxBalance = wallet.balance;
            this.maxPath = report.path;
        }
        if(wallet.balance < this.minBalance) {
            this.minReport = report;
            this.minBalance = wallet.balance;
            this.minPath = report.path;
        }

        Elephant.memReport(report);

        return report;
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

        return this.paths;
    }

    hikePath() {
        if(!this.path) throw "No path set";

        let currentWallet = this.sourceWallet;

        for(let i=1; i< this.path.length; i++) {
            let newCoin = Coins.getCoin(this.path[i]);

            if(!newCoin) throw "Intermediate coin invalid";

            let newWallet = new Wallet(currentWallet);
            newWallet.convertToCoin(newCoin);

            currentWallet = newWallet;
        }
        const report = this._storePath(currentWallet);
        console.log(`${report.sourceBalance} ${report.sourceCoin} -> ${report.finalBalance} ${report.finalCoin} -  ${report.path}`);
        return report;
    }

    isUncommon() {
        const maxLength = this.maxPath.split('_').length;
        const minLength = this.minPath.split('_').length;

        if(maxLength > 2 || minLength === 2 || this.maxBalance > this.initMaxBalance) {
            return true;
        }
        return false;
    }

    getReport(wallet) {
        const walletPath = Hiker.getWalletPath(wallet);

        return {
            path: Hiker.getCoinPath(walletPath.map(wallet => wallet.coin)),
            sourceCoin: walletPath[0].coin.symbol,
            sourceBalance: walletPath[0].balance,
            finalCoin: walletPath[walletPath.length -1].coin.symbol,
            finalBalance: walletPath[walletPath.length -1].balance,
            directBalance: this.directResult.wallet.balance
        };
    }

    static getWalletPath(wallet) {
        let walletPath = [wallet];
        let parentWallet = wallet.parent;
        while(parentWallet) {
            walletPath = walletPath.concat(parentWallet);
            parentWallet = parentWallet.parent;
        }
        walletPath = walletPath.reverse();

        return walletPath;
    }

    static getCoinPath(coinArray) {
        return coinArray.map(coin => coin.symbol).join('_');
    }
}

module.exports = Hiker;