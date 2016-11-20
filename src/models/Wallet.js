class Wallet {
    constructor(wallet, balance) {
        this.parent = null;
        this.children = [];

        if(wallet instanceof Wallet) {
            this.coin = wallet.coin;
            this.balance = wallet.balance;
            this.parent = wallet;
            wallet.addChild(this);
            this.height = wallet.height + 1;
        } else {
            let coin = wallet;
            this.coin = coin;
            this.balance = balance || 0;
            this.height = 0;
        }
    }

    convertToCoin(destinationCoin) {
        let link = this.coin.getRateWith(destinationCoin);
        if(!link) {
            throw "No link between " + this.coin.symbol + '_' + destinationCoin.symbol;
        }

        this.balance = Wallet.change(this.balance, link);
        this.coin = destinationCoin;
    }

    static change(balance, link) {
        return balance * link.rate;
    }

    addChild(child) {
        this.children = this.children.concat(child);
    }
}

module.exports = Wallet;