'use strict';
import os from 'os';

export const SERVER_PORT = process.env.SERVER_PORT || 3000;
export const LOGGER_LEVEL = process.env.LOGGER_LEVEL || 'info';

export const NUM_PHANTOMS = process.env.NUM_PHANTOMS || 2;
export const NUM_NODES = process.env.NUM_NODES || Math.floor(os.cpus().length / (NUM_PHANTOMS + 1));