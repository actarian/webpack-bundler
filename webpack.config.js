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
    devtool: options.devtool,
    devServer: options.devServer,
    entry: options.entry,
    mode: options.mode,
    module: {
        rules: [rules.typescript, rules.sass, rules.html, rules.images, rules.fonts, ]
    },
    optimization: {
        minimizer: [plugins.uglifyJs, ],
        splitChunks: plugins.splitChunks,
    },
    output: {
        chunkFilename: options.names.chunkFilename,
        filename: options.names.filename,
        sourceMapFilename: options.names.sourceMapFilename,
        path: options.dist,
        publicPath: options.public,
        // pathinfo: true, // !!!
    },
    plugins: [
        plugins.hotModuleReplacement,
        plugins.htmlWebpack,
        plugins.faviconWebpack,
        plugins.sourceMapDevTool,
        plugins.extractText,
    ],
    resolve: {
        alias: options.alias,
        extensions: options.extensions,
        modules: options.modules,
    },
};

module.exports = config;