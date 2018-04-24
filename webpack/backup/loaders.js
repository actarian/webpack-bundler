/* jshint esversion: 6, node: true */

'use strict';

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const path = require('path');

exports.tslint = {
    test: /\.ts$/,
    loader: 'tslint',
    exclude: [
        /node_modules/,
        /typings\/custom/
    ],
};

exports.istanbulInstrumenter = {
    test: /^(.(?!\.test))*\.ts$/,
    loader: 'istanbul-instrumenter-loader',
};

exports.ts = {
    test: /\.ts$/,
    loader: 'babel-loader!awesome-typescript-loader',
    exclude: [
        /node_modules/,
        /typings\/custom/
    ],
};

exports.js = {
    test: /\.js$/,
    loader: 'babel',
    exclude: /node_modules/,
};

exports.html = {
    test: /\.html$/,
    loader: 'raw',
    exclude: /node_modules/,
};

exports.scssprod = {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract('css?sourceMap&modules&importLoaders=2&localIdentName=[name]__[local]!resolve-url!sass?config=sassLoader'),
    exclude: /\.(eot|woff|woff2|ttf|svg)(\?[\s\S]+)?$/
};

exports.scssdev = {
    test: /\.scss$/,
    loader: 'style!css?sourceMap&modules&importLoaders=2&localIdentName=[name]__[local]!resolve-url!sass?config=sassLoader',
    exclude: /node_modules/,
};

exports.css = {
    test: /\.s?(a|c)ss$/,
    loader: 'style!css?-minimize&sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]!resolve-url',
    exclude: /node_modules/,
};

exports.fonts = {
    test: /\.(eot|woff|woff2|ttf|svg)(\?[\s\S]+)?$/,
    loader: 'url-loader?limit=1000&name=fonts/[name].[ext]',
    exclude: /node_modules/,
    include: [path.resolve(__dirname, 'node_modules/mdi/fonts')]
};