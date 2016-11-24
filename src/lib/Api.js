const express = require('express');

const Army = require('./Army');
const Elephant = require('../models/Elephant');

const normalize = report => {
    return report; // TODO delete references circular
};

const API = () => {
    const app = express();

    app.set('PORT', process.env.PORT || 3000);
    app.get('/', function (req, res) {
        res.status(200).send();
    });


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
    app.get('/getSortedPaths', (req, res, next) => {
        let fromCoin = req.query.fromCoin;
        let toCoin = req.query.toCoin;
        if(!fromCoin) return next("Please provide fromCoin");
        if(!toCoin) return next("Please provide toCoin");
        fromCoin = req.query.fromCoin.toUpperCase();
        toCoin = req.query.toCoin.toUpperCase();
        const limit = req.query.limit || 10;

        Elephant.getSortedPaths(fromCoin, toCoin, limit)
            .then(sortedPaths => {
                res.send(sortedPaths);
            })
            .catch(next);
    });
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
    app.get('/listBestPaths', (req, res, next) => {
        const limit = req.query.limit || 10;

        Elephant.listBestPaths(limit)
            .then(bestPaths => {
                res.send(bestPaths);
            })
            .catch(next);
    });

    app.use((error, req, res, next) => {
        console.log(error);
        res.status(500).send(error.message || error);
    });

    app.listen(app.get('PORT'), () => console.log(`Listening on port ${app.get('PORT')}`));
};

module.exports = API;