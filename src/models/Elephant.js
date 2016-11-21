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

    getSortedPaths(sourceCoin, destCoin, limit = 10) {
        const paths = [];

        const reportIterator = this.reports.values();
        let currentReport;
        while(currentReport = reportIterator.next().value) {
            if(currentReport.sourceCoin === sourceCoin && currentReport.finalCoin === destCoin) {
                paths.push(currentReport);
            }
        }
        const sortedPaths = paths.sort((a,b) => {
            return a.sourceBalance*a.finalBalance < b.sourceBalance*b.finalBalance;
        });

        return sortedPaths;
    }
}

const elephantInstance = new Elephant();

module.exports = elephantInstance;