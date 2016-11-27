const fs = require('fs');

class Elephant {
    constructor() {
        // TODO distribute memory
        this.reports = new Map();
    }

    memReport(report) {
        this.reports.set(report.path, report);
    }

    getReport(path) {
        return this.reports.get(path);
    }

    get size() {
        return this.reports.size;
    }

    listBestPaths(limit = 10, takeAll = false, aggregate = false) {
        let paths = [];

        const reportIterator = this.reports.values();
        let currentReport;
        while(currentReport = reportIterator.next().value) {
            if(takeAll || currentReport.benefit > 1) {
                paths.push(currentReport);
            }
        }

        let sortedPaths = paths.sort((a,b) => {
            return b.benefit - a.benefit;
        });
        let resultPaths = sortedPaths;

        // TODO
        if(aggregate) {
            const sourceAgg = [];
            const destAgg = [];
            let aggregatedPath = [];
            for (var i = 0; i < resultPaths.length; i++) {
                var path = resultPaths[i];

                if(sourceAgg.indexOf(path.sourceCoin) === -1 &&
                    destAgg.indexOf(path.destCoin) === -1)
                {
                    aggregatedPath.push(path);
                    sourceAgg.push(path.sourceCoin);
                    destAgg.push(path.destCoin);
                }
            }
            resultPaths = aggregatedPath;
        }

        resultPaths = resultPaths.slice(0, limit);

        return Promise.resolve(resultPaths);
    }

    getSortedPaths(options = {}) {
        let {fromCoin = null, toCoin = null, limit = 10} = options;

        const paths = [];
        const reportIterator = this.reports.values();
        let currentReport;
        while(currentReport = reportIterator.next().value) {
            if((!fromCoin || currentReport.sourceCoin === fromCoin) && (!toCoin || currentReport.finalCoin === toCoin)) {
                paths.push(currentReport);
            }
        }
        let sortedPaths = paths.sort((a,b) => {
            return b.benefit - a.benefit;
        }).slice(0, limit);

        if(sortedPaths.length > 0) {
            return Promise.resolve(sortedPaths);
        } else {
            return Promise.reject("Path not yet computed, either explicitly hike it or wait until it is automatically fetched");
        }
    }

    getBestPath(sourceCoin, destCoin) {
        return this.getSortedPaths({sourceCoin, destCoin, limit: 1})
            .then(sortedPaths => sortedPaths[0]);
    }

    toJson() {
        let data = [];
        const reportIterator = this.reports.values();
        let currentReport;
        while(currentReport = reportIterator.next().value) {
            data.push(currentReport);
        }

        // todo bufferify (RangeError: Invalid string length)
        return JSON.stringify(data, null, 2);
    }

    write() {
        const json = this.toJson();
        fs.writeFileSync("./data/elephant.json", json);
        console.log("Wrote elephant")
    }
}

const elephantInstance = new Elephant();

module.exports = elephantInstance;