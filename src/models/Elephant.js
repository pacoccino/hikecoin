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

    listBestPaths(limit = 10, takeAll = false) {
        const paths = [];
        // TODO aggregate by source/dest

        const reportIterator = this.reports.values();
        let currentReport;
        while(currentReport = reportIterator.next().value) {
            if(takeAll || currentReport.benefit > 1) {
                paths.push(currentReport);
            }
        }

        let sortedPaths = paths.sort((a,b) => {
            return b.benefit - a.benefit;
        }).slice(0, limit);

        return Promise.resolve(sortedPaths);
    }

    getSortedPaths(sourceCoin, destCoin, limit = 10) {
        const paths = [];

        const reportIterator = this.reports.values();
        let currentReport;
        while(currentReport = reportIterator.next().value) {
            if(currentReport.sourceCoin === sourceCoin && currentReport.finalCoin === destCoin) {
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
        return this.getSortedPaths(sourceCoin, destCoin, 1)
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