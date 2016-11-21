const cluster = require('cluster');

const clusterize = (App) => {

    if (cluster.isMaster) {

        console.log('spawning consumers');

        for (let i = 0; i < process.numCPU; i++) {
            cluster.fork();
        }

        console.log('consumers started');

        // If a worker exits, we wait 30 seconds and restart it.
        cluster.on('exit', (deadWorker, code, signal) => {
            console.log({workerId: deadWorker.id}, 'consumer exited, waiting 30s');

            setTimeout(
                () => {
                    let newWorker = cluster.fork();

                    console.log({workerId: newWorker.id}, 'restarted consumer');
                },
                30000
            );
        });
    } else {
        App();
    }
};

module.exports = clusterize;