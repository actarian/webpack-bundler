/* jshint esversion: 6, node: true */

'use strict';

const path = require('path');
const json = require('../webpack.json');

class Options {
    constructor() {
        this.context = path.resolve(__dirname, '../');
        this.src = path.join(this.context, './src/');
        this.dist = path.join(this.context, './docs/');
        this.mode = process.argv.indexOf('-p') !== -1 ? 'production' : 'development';
        this.production = this.mode === 'production';
        this.development = this.mode === 'development';
        this.argv = process.argv;
        console.log('Options', this.src, this.dist, this.mode);
    }
}

module.exports = Options;