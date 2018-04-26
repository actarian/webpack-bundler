/* jshint esversion: 6, node: true */

'use strict';

const path = require('path');
const defaultOptions = require('./defaults.options.json');
const userOptions = require('../webpack.options.json');

class Options {

    constructor() {
        let options = Object.assign({}, defaultOptions);
        if (userOptions) {
            options = Object.assign(options, userOptions);
            if (userOptions.devServer) {
                options.devServer = Object.assign(defaultOptions.devServer, userOptions.devServer);
            }
        }
        const context = path.resolve(__dirname, '../');
        const argv = process.argv;
        let mode = options.mode;
        if (argv.indexOf('-p') !== -1) mode = 'production';
        if (argv.indexOf('-d') !== -1) mode = 'development';
        //
        this.context = context;
        this.src = path.join(context, options.src);
        this.dist = path.join(context, options.dist);
        this.public = options.public;
        this.title = options.title;
        this.icon = options.icon;
        this.mode = mode;
        this.argv = argv;
        this.production = mode === 'production';
        this.development = mode === 'development';
        this.names = options.names[mode];
        this.plugins = options.plugins;
        this.alias = options.alias;
        this.devtool = this.development ? 'inline-source-map' : 'source-map';
        this.devServer = options.devServer;
        this.devServer.contentBase = this.dist;
        this.extensions = ['.js', '.scss', '.html', ];
        this.modules = ['node_modules', ];
        // 
        this.entry = Object.assign({}, options.entry);
        for (let key in this.entry) {
            if (this.entry.hasOwnProperty(key)) {
                this.entry[key] = this.src + this.entry[key];
            }
        }
        console.log('Options', mode);
    }

    getName(filename, name) {
        if (name.indexOf('[path]') !== -1) {
            let dirname = path.dirname(filename);
            dirname = path.normalize(dirname);
            if (dirname.indexOf(this.src) === 0) {
                dirname = dirname.replace(this.src, '');
                if (dirname.indexOf('img' + path.sep) === 0) {
                    dirname = dirname.replace('img' + path.sep, '');
                }
                if (dirname === 'img') {
                    dirname = '';
                }
            } else {
                dirname = dirname.replace(this.context, '');
                dirname = dirname.indexOf(path.sep) === 0 ? dirname.substr(1) : dirname;
                if (dirname.indexOf('node_modules' + path.sep) !== -1) {
                    dirname = dirname.replace('node_modules' + path.sep, '');
                }
            }
            if (dirname.length && dirname.lastIndexOf(path.sep) !== dirname.length - 1) {
                dirname = dirname + path.sep;
            }
            name = name.replace('[path]', dirname);
            console.log('Options.getName', 'filename', filename, 'dirname', dirname, 'name', name);
        }
        return name;
    }

}

module.exports = Options;