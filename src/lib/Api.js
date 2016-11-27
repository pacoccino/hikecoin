const express = require('express');
const cors = require('cors');

const Army = require('./Army');
const Elephant = require('../models/Elephant');

const API = () => {
    const app = express();

    app.set('PORT', process.env.PORT || 3000);
    // app.get('/', (req, res) => res.status(200).send());

    app.use(cors());

    /**
     * @api /* Report Model
     * @apiName Report
     * @apiGroup Models
     * @apiDescription Report model of every request
     *
     *
     * @apiSuccess {Object} report Report Object
     * @apiSuccess {String} report.path Hiked path
     * @apiSuccess {String} report.sourceCoin Initial coin symbol
     * @apiSuccess {String} report.sourceBalance  Initial balance
     * @apiSuccess {String} report.finalCoin  Final coin symbol
     * @apiSuccess {String} report.finalBalance  Final balance
     * @apiSuccess {String} report.directBalance  Direct balance (from input coin to output coin)
     * @apiSuccess {String} report.benefit  Ratio finalBalance/directBalance
     */


    /**
     * @api {get} /hikePath Hike coin path
     * @apiName HikePath
     * @apiGroup Hiking
     * @apiDescription Compute how much money you get by converting through different coins
     *
     * @apiParam {String} path Coin path, separated by '_' (ex: BTC_DOGE_ETH)
     *
     * @apiSuccess {Object} report Report object - See Models
     */
    app.get('/hikePath', (req, res, next) => {
        let path = req.query.path;
        if(!path) return next("Please provide a path");

        path = path.split("_").map(coin => coin.toUpperCase()).join("_");

        Army.hikePath(path)
            .then(report => {
                res.send(report);
            })
            .catch(next);
    });

    /**
     * @api {get} /hikeCoin Hike loop from and to a coin
     * @apiName HikeCoin
     * @apiGroup Hiking
     * @apiDescription Compute every path possible from a coin to the same coin
     *
     * @apiParam {String} coin Input/Output coin (ex: BTC)
     *
     * @apiSuccess {Object[]} report Report object - See Models
     */
    app.get('/hikeCoin', (req, res, next) => {
        let coin = req.query.coin;
        if(!coin) return next("Please provide a coin");
        coin = coin.toUpperCase();

        Army.hikeCoin(coin)
            .then(report => {
                res.send(report);
            })
            .catch(next);
    });


    /**
     * @api {get} /hikeLink Hike from a coin to another
     * @apiName HikeLink
     * @apiGroup Hiking
     * @apiDescription Compute every path possible from a coin to another coin
     *
     * @apiParam {String} fromCoin Input coin (ex: BTC)
     * @apiParam {String} toCoin Output coin (ex: DOGE)
     *
     * @apiSuccess {Object[]} report Report object - See Models
     */
    app.get('/hikeLink', (req, res, next) => {
        let fromCoin = req.query.fromCoin;
        let toCoin = req.query.toCoin;
        if(!fromCoin) return next("Please provide fromCoin");
        if(!toCoin) return next("Please provide toCoin");
        fromCoin = req.query.fromCoin.toUpperCase();
        toCoin = req.query.toCoin.toUpperCase();

        Army.hikeLink(fromCoin, toCoin)
            .then(report => {
                res.send(report);
            })
            .catch(next);
    });

    /**
     * @api {get} /getSortedPaths Get best paths
     * @apiName Get Sorted links
     * @apiGroup Elephant
     * @apiDescription Get every pre-computed paths from one coin to another sorted by best benefit first
     *
     * @apiParam {String} [fromCoin] Input coin (ex: BTC)
     * @apiParam {String} [toCoin] Output coin (ex: DOGE)
     * @apiParam {number} [limit=10] Limit the results
     *
     * @apiSuccess {Object[]} report Report object - See Models
     */
    app.get('/getSortedPaths', (req, res, next) => {
        let fromCoin = req.query.fromCoin || "";
        let toCoin = req.query.toCoin || "";
        fromCoin = req.query.fromCoin.toUpperCase();
        toCoin = req.query.toCoin.toUpperCase();
        const limit = req.query.limit || 10;

        Elephant.getSortedPaths({fromCoin, toCoin, limit})
            .then(sortedPaths => {
                res.send(sortedPaths);
            })
            .catch(next);
    });

    /**
     * @api {get} /getBestPath Get best path
     * @apiName Get best path
     * @apiGroup Elephant
     * @apiDescription Get pre-computed best path from one coin to another
     *
     * @apiParam {String} fromCoin Input coin (ex: BTC)
     * @apiParam {String} toCoin Output coin (ex: DOGE)
     *
     * @apiExample Example usage:
     * curl -i https://hikecoin-upclfhddxa.now.sh/getBestPath?fromCoin=DOGE&toCoin=BTC&
     *
     * @apiSuccess {Object} report Report object - See Models
     */
    app.get('/getBestPath', (req, res, next) => {
        let fromCoin = req.query.fromCoin;
        let toCoin = req.query.toCoin;
        if(!fromCoin) return next("Please provide fromCoin");
        if(!toCoin) return next("Please provide toCoin");
        fromCoin = req.query.fromCoin.toUpperCase();
        toCoin = req.query.toCoin.toUpperCase();

        Elephant.getBestPath(fromCoin, toCoin)
            .then(bestPath => {
                res.send(bestPath);
            })
            .catch(next);
    });

    /**
     * @api {get} /listBestPaths List best paths
     * @apiName List best paths
     * @apiGroup Elephant
     * @apiDescription List every best pre-computed paths sorted by best benefit first
     *
     * @apiParam {number} [limit=10] Limit the results
     * @apiParam {boolean} [takeAll=false] Keep all results (even minor benefit)
     *
     * @apiSuccess {Object[]} report Report object - See Models
     */
    app.get('/listBestPaths', (req, res, next) => {
        const limit = req.query.limit || 10;
        const takeAll = req.query.takeAll === 'true' || false;
        const agg = req.query.agg === 'true' || false;

        Elephant.listBestPaths(limit, takeAll, agg)
            .then(bestPaths => {
                res.send(bestPaths);
            })
            .catch(next);
    });

    /* TODO:
        - list only valuables
        - unique call to sorted best with from and to optionals
     */

    app.use((error, req, res, next) => {
        console.log(error);
        res.status(500).send(error.message || error);
    });

    app.use(express.static('doc'));
    app.listen(app.get('PORT'), () => console.log(`Listening on port ${app.get('PORT')}`));
};

module.exports = API;