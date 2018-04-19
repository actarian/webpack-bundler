/* jshint esversion: 6, node: true */

'use strict';

const path = require('path');
const proxy = require('./server/webpack-dev-proxy');
const loaders = require('./webpack/loaders');
const plugins = require('./webpack/plugins');
const postcssInit = require('./webpack/postcss');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const bourbon = require('node-bourbon').includePaths;

module.exports = {
    entry: {
        app: './src/app.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: process.env.NODE_ENV === 'production' ?
            '[name].[chunkhash].js' : '[name].js',
        publicPath: '/',
        sourceMapFilename: process.env.NODE_ENV === 'production' ?
            '[name].[chunkhash].js.map' : '[name].js.map',
        chunkFilename: process.env.NODE_ENV === 'production' ?
            '[name].chunk.[chunkhash].js' : '[name].js',
    },

    devtool: process.env.NODE_ENV === 'production' ?
        'source-map' : 'inline-source-map',

    resolve: {
        //modulesDirectories: ['node_modules'],
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js', '.scss']
    },
    plugins: plugins,
    //postcss: postcssInit,

    devServer: {
        contentBase: './src',
        historyApiFallback: {
            index: '/'
        },
        proxy: Object.assign({}, proxy(), {
            '/api/*': 'http://localhost:3000'
        }),
    },

    module: {
        preLoaders: [
            //loaders.tslint,
        ],
        loaders: [
            loaders.ts,
            loaders.js,
            loaders.html,
            process.env.NODE_ENV === 'production' ? loaders.scssprod : loaders.scssdev,
            loaders.fonts,
        ],
    },
    sassLoader: {
        sourceMap: true,
        includePaths: [bourbon, path.resolve(__dirname, 'node_modules/mdi/scss')],
        excludePaths: [path.resolve(__dirname, 'node_modules')],
    }
};