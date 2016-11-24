class Elephant {
    constructor() {
        this.reports = new Map();
    }

    memReport(report) {
        this.reports.set(report.path, report);
    }

    getReport(path) {
        return this.reports.get(path);
    }

    listBestPaths(limit = 10) {
        const paths = [];

        const reportIterator = this.reports.values();
        let currentReport;
        while(currentReport = reportIterator.next().value) {
            if(currentReport.benefit >= 1) {
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
}

const elephantInstance = new Elephant();

module.exports = elephantInstance;