/* jshint esversion: 6, node: true */

'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const SplitByPathPlugin = require('webpack-split-by-path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const path = require('path');

const sourceMap = process.env.TEST ? [new webpack.SourceMapDevToolPlugin({
    filename: null,
    test: /\.ts$/
})] : [];

const basePlugins = [
    new webpack.DefinePlugin({
        __DEV__: process.env.NODE_ENV !== 'production',
        __PRODUCTION__: process.env.NODE_ENV === 'production',
        __TEST__: JSON.stringify(process.env.TEST || false),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new HtmlWebpackPlugin({
        chunksSortMode: 'dependency',
        template: './src/index.html',
        inject: 'body',
    }),
    new webpack.NoErrorsPlugin(),
    new CopyWebpackPlugin([{
            from: 'src/img',
            to: 'img'
        },
        {
            from: 'src/partials',
            to: 'partials'
        },
        {
            from: './node_modules/lumX/dist/lumx.css',
            to: 'lumx.css'
        },
        {
            from: './node_modules/mdi/css/materialdesignicons.css',
            to: 'materialdesignicons.css'
        },
        {
            from: './node_modules/angular-material/angular-material.css',
            to: 'angular-material.css'
        },
        {
            from: './node_modules/angular-ranger/angular-ranger.css',
            to: 'angular-ranger.css'
        },
    ]),
    new ForkCheckerPlugin(),
    new ExtractTextPlugin(process.env.NODE_ENV === 'production' ? '[name].chunk.[chunkhash].css' : '[name].css', {
        allChunks: true
    }),
].concat(sourceMap);

const devPlugins = [
    new StyleLintPlugin({
        configFile: './.stylelintrc',
        files: ['src/**/*.s?(a|c)ss'],
        failOnError: false,
    }),
];

const prodPlugins = [
    new SplitByPathPlugin([{
        name: 'vendor',
        path: [path.join(__dirname, '../', '/node_modules/')]
    }, ]),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
        },
    }),
];

module.exports = basePlugins
    .concat(process.env.NODE_ENV === 'production' ? prodPlugins : [])
    .concat(process.env.NODE_ENV === 'development' ? devPlugins : []);