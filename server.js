var cluster = require('cluster');

if (cluster.isMaster) {
    cluster.fork();

    cluster.on('exit', function(worker, code, signal) {
        cluster.fork();
    });
}
else if (cluster.isWorker) {
    var express = require('express');
    var app     = express();
    var api     = require('./api');
    var log     = require('./log');

    api.listen(8000);
    log.info('API now listening on port 8000');
}