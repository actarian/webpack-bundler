/* jshint esversion: 6, node: true */

'use strict';

const path = require('path');
const defaults = require('./defaults.json');
const bundle = require('../webpack.bundle.json');

class Options {

    constructor() {
        const argv = process.argv;
        const context = path.resolve(__dirname, '../');
        const options = bundle ? Object.assign(defaults, bundle) : defaults;
        let mode = options.mode;
        if (argv.indexOf('-p') !== -1) mode = 'production';
        if (argv.indexOf('-d') !== -1) mode = 'development';
        //
        this.context = context;
        this.src = path.join(context, options.src);
        this.dist = path.join(context, options.dist);
        this.public = options.public;
        this.mode = mode;
        this.argv = argv;
        this.production = mode === 'production';
        this.development = mode === 'development';
        this.names = options.names[mode];
        this.alias = options.alias;
        this.devtool = this.development ? 'inline-source-map' : 'source-map';
        // 
        this.entry = Object.assign({}, options.entry);
        for (let key in this.entry) {
            if (this.entry.hasOwnProperty(key)) {
                this.entry[key] = this.src + this.entry[key];
            }
        }
        console.log('Options', mode);
    }

}

module.exports = Options;