var Decimal = require('decimal.js');

class Wallet {
    constructor(wallet, balance) {
        this.parent = null;
        this.children = [];

        if(wallet instanceof Wallet) {
            this.coin = wallet.coin;
            this.bigBalance = new Decimal(wallet.balance);
            this.parent = wallet;
            wallet.addChild(this);
            this.height = wallet.height + 1;
        } else {
            let coin = wallet;
            this.coin = coin;
            this.bigBalance = new Decimal(balance || 0);
            this.height = 0;
        }
    }

    get balance() {
        return this.bigBalance.toNumber();
    }

    convertToCoin(destinationCoin) {
        if(destinationCoin === this.coin) return;

        let link = this.coin.getRateWith(destinationCoin);
        if(!link) {
            throw "No link between " + this.coin.symbol + '_' + destinationCoin.symbol;
        }

        this.bigBalance = Wallet.change(this.bigBalance, link);
        this.coin = destinationCoin;
    }

    static change(balance, link) {
        return balance.times(link.rate);
    }

    addChild(child) {
        this.children = this.children.concat(child);
    }
}

module.exports = Wallet;