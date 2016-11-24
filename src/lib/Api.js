const express = require('express');

const Army = require('./Army');

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
        const path = req.query.path;

        Army.hikePath(path)
            .then(report => {
                res.send(report);
            })
            .catch(next);
    });

    app.get('/hikeCoin', (req, res, next) => {
        const coin = req.query.coin;

        Army.hikeCoin(path)
            .then(report => {
                res.send(report);
            })
            .catch(next);
    });
    app.get('/hikeLink', (req, res, next) => {
        const fromCoin = req.query.fromCoin;
        const toCoin = req.query.toCoin;

        Army.hikeLink(fromCoin, toCoin)
            .then(report => {
                res.send(report);
            })
            .catch(next);
    });

    app.use((error, req, res, next) => {
        res.status(500).send(error);
    });

    app.listen(app.get('PORT'), () => console.log(`Listening on port ${app.get('PORT')}`));
};

module.exports = API;