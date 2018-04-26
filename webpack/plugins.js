/* jshint esversion: 6, node: true */

'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const StyleLintPlugin = require('stylelint-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const cssimport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

class Plugins {
    constructor(options) {
        var plugins = {
            hotModuleReplacement: new webpack.HotModuleReplacementPlugin(),
            htmlWebpack: new HtmlWebpackPlugin({
                template: options.src + 'index.html',
                minify: options.production,
            }),
            faviconWebpack: new FaviconsWebpackPlugin({
                background: '#fff',
                icons: {
                    android: true,
                    appleIcon: true,
                    appleStartup: true,
                    coast: false,
                    favicons: true,
                    firefox: true,
                    opengraph: false,
                    twitter: false,
                    yandex: false,
                    windows: false
                },
                inject: true,
                logo: options.icon,
                persistentCache: true,
                prefix: 'img/icons/',
                statsFilename: 'iconstats-[hash].json',
                title: options.title,
            }),
            extractText: new ExtractTextPlugin(options.names.css, {
                allChunks: true
            }),
            sourceMapDevTool: new webpack.SourceMapDevToolPlugin({
                filename: options.names.sourceMapFilename,
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
                sourceMap: false,
                uglifyOptions: {
                    // sourceMap: false,
                    compress: {
                        sequences: true,
                        dead_code: true,
                        conditionals: true,
                        booleans: true,
                        unused: true,
                        if_return: true,
                        join_vars: true,
                        drop_console: true
                    },
                    ecma: 5,
                    mangle: true,
                    output: {
                        comments: false,
                        beautify: false,
                    }
                },
            }),
            postCss: {
                ident: 'postcss',
                plugins: function () {
                    let list = [];
                    if (options.plugins.cssimport) {
                        list.push(cssimport({
                            addDependencyTo: webpack,
                            root: function (file) {
                                return file.dirname;
                            }
                        }));
                    }
                    if (options.plugins.cssnext) {
                        list.push(cssnext());
                    }
                    list.push(autoprefixer(options.plugins.autoprefixer));
                    if (options.plugins.cssnano) {
                        list.push(cssnano({
                            safe: true,
                            sourcemap: true,
                            autoprefixer: false,
                        }));
                    }
                    return list;
                },
                sourceMap: true, // !options.production,
            }
        };
        for (var p in plugins) {
            this[p] = plugins[p];
        }
    }
}

module.exports = Plugins;