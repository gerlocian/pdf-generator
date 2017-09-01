'use strict';

import fs from 'fs';
import mustache from 'mustache';
import path from 'path';
import pdf from 'html-pdf';
import { getLogger } from './loggers';

const logger = getLogger('renderer');

export function render (templateName) {
    logger.debug(`Preparing template "${templateName}"...`);
    let response = fs.readFileSync(path.resolve(__dirname, '..', 'templates', `${templateName}.html`));
    let template = response.toString();
    mustache.parse(template);
    logger.debug(`"${templateName}" prepared!`)

    return function (req, res) {
        logger.debug(`Rendering ${templateName}`);
        let render = mustache.render(template, req.body);
        pdf.create(render).toBuffer((err, buffer) => {
            res.header('Content-Type', 'application/pdf');
            res.send(buffer);
        });
    }
}