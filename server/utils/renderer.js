'use strict';

import fs from 'fs';
import mustache from 'mustache';
import path from 'path';
import phantomPdfToHtml from 'phantom-html-to-pdf';
import { path as phantomPath } from 'phantomjs';
import { getLogger } from './loggers';
import * as config from './config';

const logger = getLogger('renderer');
const converter = phantomPdfToHtml({
    numberOfWorkers: config.NUM_PHANTOMS,
    //tmpDir: path.resolve('tmp', 'pdf-generator'),
    //strategy: 'phantom-server',
    phantomPath: phantomPath
});

export function render(templateName, options) {
    logger.debug(`Preparing template "${templateName}"...`);
    let response = fs.readFileSync(path.resolve(__dirname, '..', 'templates', `${templateName}.html`));
    let template = response.toString();
    mustache.parse(template);
    logger.debug(`"${templateName}" prepared!`);

    return function (req, res) {
        logger.debug(`Rendering ${templateName}`);
        let render = mustache.render(template, req.body);
        converter({
            html: render,
            footer: '<div style="font-size:10px;text-align:center;color:rgba(0,0,0,0.5);">{#pageNum} / {#numPages}</div>',
            paperSize: {
                margin: '0.75in',
                format: 'Letter',
                orientation: 'portrait',
                footerHeight: '0.15in'
            }
        }, (err, pdf) => {
            if (err) logger.error(err);
            logger.debug(`Rendered ${templateName}`);
            //console.log(pdf);
            //res.send('OK');
            pdf.stream.pipe(res);
        });
    }
}

/*
const pdfOptions = {
    "format": "Letter",
    "orientation": "portrait",
    "border": "0.75in",
    "footer": {
        "height": "0.15in",
        "contents": {
            "default": '<div style="font-size:10px;text-align:center;color:rgba(0,0,0,0.5);">{{page}} / {{pages}}</div>'
        }
    }
};

export function render (templateName, options=pdfOptions) {
    logger.debug(`Preparing template "${templateName}"...`);
    let response = fs.readFileSync(path.resolve(__dirname, '..', 'templates', `${templateName}.html`));
    let template = response.toString();
    mustache.parse(template);
    logger.debug(`"${templateName}" prepared!`)

    return function (req, res) {
        logger.debug(`Rendering ${templateName}`);
        let render = mustache.render(template, req.body);

        pdf.create(render, options).toBuffer((err, buffer) => {
            res.header('Content-Type', 'application/pdf');
            res.send(buffer);
        });
    }
}

// Diagnostic url for testing to response and not downloading the pdf.
export function renderHead (templateName, options=pdfOptions) {
    logger.debug(`Preparing template "${templateName}"...`);
    let response = fs.readFileSync(path.resolve(__dirname, '..', 'templates', `${templateName}.html`));
    let template = response.toString();
    mustache.parse(template);
    logger.debug(`"${templateName}" prepared!`)

    return function (req, res) {
        logger.debug(`Rendering ${templateName}`);
        let render = mustache.render(template, {title: 'Hello World!'});

        pdf.create(render, options).toBuffer((err, buffer) => {
            logger.debug('Headers being sent');
            res.send('OK');
        });
    }
}
*/