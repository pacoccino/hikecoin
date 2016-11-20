const rq = require('request-promise-native');

class ShapeShift {
    constructor() {
    }

    static get baseUrl() {
        return "https://shapeshift.io/";
    }

    async _request(r) {
        const options = {};

        options.url = ShapeShift.baseUrl + r.endpoint;
        options.json = true;

        try {
            return await rq(options);
        } catch(e) {
            const returnedError = new Error(e.message);
            throw returnedError;
        }
    }
    async marketInfo(symbolPair) {
        const req = {
            endpoint: "marketinfo"
        };
        if(symbolPair) {
            req.endpoint += '/' + symbolPair
        }
        return await this._request(req)
    }
    async getCoins() {
        const req = {
            endpoint: "getCoins"
        };

        return await this._request(req)
    }
}

const shapeShiftInstance = new ShapeShift();

module.exports = shapeShiftInstance;