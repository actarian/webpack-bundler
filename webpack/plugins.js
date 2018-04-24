/* jshint esversion: 6, node: true */

'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const StyleLintPlugin = require('stylelint-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const postcss = require('postcss');
// const autoprefixer = require('autoprefixer');

class Plugins {
    constructor(options) {
        var plugins = {
            hotModuleReplacement: new webpack.HotModuleReplacementPlugin(),
            htmlWebpack: new HtmlWebpackPlugin({
                template: options.src + 'index.html',
            }),
            extractText: new ExtractTextPlugin(options.development ? 'css/[name].css' : 'css/[name].[hash].css', {
                allChunks: true
            }),
            sourceMapDevTool: new webpack.SourceMapDevToolPlugin({
                filename: options.development ? 'js/[name].js.map' : 'js/[name].[hash].js.map',
                exclude: ['vendors.js'],
            }),
            styleLint: new StyleLintPlugin({
                emitErrors: true,
                failOnError: false,
                syntax: 'scss',
            }),
            uglifyJs: new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    compress: false,
                    ecma: 5,
                    mangle: true,
                    output: {
                        comments: false,
                        beautify: false,
                    }
                },
                sourceMap: false
            }),
        };
        for (var p in plugins) {
            this[p] = plugins[p];
        }
    }
}

module.exports = Plugins;