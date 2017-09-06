'use strict';

import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';
import cluster from 'cluster';
import * as config from './utils/config';
import { getLogger } from './utils/loggers';
import * as renderer from './utils/renderer';

const logger = getLogger('server');

if (cluster.isMaster) {
    for (let i = 0; i < config.NUM_NODES; i += 1) {
        cluster.fork();
    }

    cluster.on('online', (worker) => {
        logger.info('Worker process started', worker.process.pid);
    });

    cluster.on('exit', (worker, code, signal) => {
        logger.info(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    logger.profile('Server build time');
    logger.debug('imports complete. building app...');

    const app = express();

    logger.debug('app complete. building middleware...');

    app.use(bodyParser.json());

    logger.debug('middleware complete. building routes...');

    // Add paths and routes here.
    app.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'index.html'));
    });

    app.post('/test', renderer.render('test'));
    // app.head('/test', renderHead('test'));

    logger.debug('routes complete. starting server...');
    logger.debug(`server port set to '${config.SERVER_PORT}'`);

    app.listen(config.SERVER_PORT, () => {
        logger.info('Server started.');
        logger.info(`Listening on port ${config.SERVER_PORT}...`);
        logger.profile('Server build time');
    });
}