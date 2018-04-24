/* jshint esversion: 6, node: true */

'use strict';

const path = require('path');
const json = require('../webpack.json');

const hashEnabled = false;
const post = hashEnabled ? '[hash]' : 'min';
const assets = hashEnabled ? '.[hash]' : '';

class Options {
    constructor() {
        this.context = path.resolve(__dirname, '../');
        this.src = path.join(this.context, './src/');
        this.dist = path.join(this.context, './docs/');
        this.mode = process.argv.indexOf('-p') !== -1 ? 'production' : 'development';
        this.production = this.mode === 'production';
        this.development = this.mode === 'development';
        this.argv = process.argv;
        this.names = {
            chunkFilename: this.development ? 'js/[name].js' : 'js/[name].' + post + '.js',
            filename: this.development ? 'js/[name].js' : 'js/[name].' + post + '.js',
            sourceMapFilename: this.development ? 'js/[name].js.map' : 'js/[name].' + post + '.js.map',
            css: this.development ? 'css/[name].css' : 'css/[name].' + post + '.css',
            images: this.development ? 'img/[name].[ext]' : 'img/[name]' + assets + '.[ext]',
            fonts: this.development ? 'fonts/[name].[ext]' : 'fonts/[name]' + assets + '.[ext]',
        };
        console.log('Options', this.src, this.dist, this.mode);
    }
}

module.exports = Options;