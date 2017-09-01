'use strict';

import express from 'express';
import fs from 'fs';
import mustache from 'mustache';
import path from 'path';
import pdf from 'html-pdf';

const app = express();

app.get('/', (req, res) => {
    fs.readFile(path.resolve(__dirname, 'templates', 'test.html'), (e, d) => {
        if (e) throw e; // ideally we do something better with this.

        let render = mustache.render(d.toString(), { test: "Hello World!" });
        pdf.create(render).toBuffer((err, buffer) => {
            res.header('Content-Type', 'application/pdf');
            res.send(buffer);
        });
    });
});

app.listen(3000, () => {
    console.log('Listening on port 3000...');
});