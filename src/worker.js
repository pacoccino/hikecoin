const worker = require('./workers/hike-worker');
const clusterize = require('./lib/Cluster');
const cluster = require('cluster');

let cl = console.log;
console.log = (a) => {
    if(cluster.worker) {
        cl(cluster.worker.id + '- ' + a)
    } else {

        cl(a);
    }
};

clusterize(worker);
// worker()