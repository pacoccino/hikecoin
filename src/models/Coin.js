const defaultInfo = {
    "name": "",
    "symbol": "",
    "image": "https://shapeshift.io/images/coins/bitcoin.png",
    "status": "unknown"
};

class Coin {
    constructor(info = defaultInfo) {

        this.name = info.name;
        this.symbol = info.symbol;
        this.image = info.image;
        this.status = info.status;

        this.avalaible = (this.status === "available");

        this.links = new Map();
    }

    updateRate(coin, rate) {
        if(!rate.rate) throw "invalid rate";
        this.links.set(coin.symbol, rate);
    }

    getRateWith(dest) {
        return this.links.get(dest.symbol);
    }
}

module.exports = Coin;