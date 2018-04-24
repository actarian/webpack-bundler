/* jshint esversion: 6, node: true */

'use strict';

const Options = require('./webpack/options');
const Plugins = require('./webpack/plugins');
const Rules = require('./webpack/rules');

const options = new Options();
const plugins = new Plugins(options);
const rules = new Rules(options, plugins);

const config = {
    context: options.context,
    devtool: options.development ? 'inline-source-map' : 'source-map',
    devServer: {
        open: true, // will open the browser
        hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
        inline: true, // inline module replacement.
        noInfo: true, // only errors & warns on hot reload
        contentBase: options.dist, // boolean | string | array, static file location
        compress: true, // enable gzip compression
        port: 9000,
        historyApiFallback: true, // true for index.html upon 404, object for multiple paths
        https: false, // true for self-signed, object for cert authority
        proxy: { // proxy URLs to backend development server
            '/api': 'http://localhost:3000'
        },
    },
    entry: {
        style: options.src + 'scss/app.scss',
        vendors: options.src + 'vendors/vendors.js',
        app: options.src + 'app/app.js',
    },
    mode: options.mode,
    module: {
        rules: [rules.sass, rules.images, rules.fonts, ]
    },
    optimization: {
        minimizer: [
            plugins.uglifyJs
        ]
    },
    output: {
        chunkFilename: options.names.chunkFilename,
        filename: options.names.filename,
        sourceMapFilename: options.names.sourceMapFilename,
        path: options.dist,
        publicPath: '/',
    },
    plugins: [
        plugins.hotModuleReplacement,
        plugins.htmlWebpack,
        plugins.sourceMapDevTool,
        plugins.extractText,
    ],
    resolve: {
        alias: {
            jquery: "jquery/src/jquery",
        },
        extensions: ['.js', '.scss'],
        modules: ['node_modules'],
    },
};

module.exports = config;