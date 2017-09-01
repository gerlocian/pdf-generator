'use strict';

import winston from 'winston';
import { LOGGER_LEVEL } from './config';

export function getLogger (loggerName) {
    winston.loggers.add(loggerName, {
        console: {
            level: LOGGER_LEVEL,
            colorize: true,
            label: loggerName
        }
    });

    return winston.loggers.get(loggerName);
}
