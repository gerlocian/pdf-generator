'use strict';

import bodyParser from 'body-parser';
import express from 'express';
import * as config from './utils/config';
import { getLogger } from './utils/loggers';
import { render } from './utils/renderer';

const logger = getLogger('server');

logger.profile('Server build time');
logger.debug('imports complete. building app...');

const app = express();

logger.debug('app complete. building middleware...');

app.use(bodyParser.json());

logger.debug('middleware complete. building routes...');

// Add paths and routes here.
app.get('/', render('test'));

logger.debug('routes complete. starting server...');
logger.debug(`server port set to '${config.SERVER_PORT}'`);

app.listen(config.SERVER_PORT, () => {
    logger.info('Server started.');
    logger.info(`Listening on port ${config.SERVER_PORT}...`);
    logger.profile('Server build time');
});