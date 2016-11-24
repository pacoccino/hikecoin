class Report {
    constructor(wallet, directResult) {
        const walletPath = Report.getWalletPath(wallet);

        this.path = Report.getCoinPath(walletPath.map(wallet => wallet.coin));
        this.sourceCoin = walletPath[0].coin.symbol;
        this.sourceBalance = walletPath[0].balance;
        this.finalCoin = walletPath[walletPath.length -1].coin.symbol;
        this.finalBalance = walletPath[walletPath.length -1].balance;
        this.directBalance = directResult.wallet.balance;
        this.benefit = this.finalBalance / this.directBalance;
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

module.exports = Report;