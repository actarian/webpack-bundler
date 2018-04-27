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
            /*
            banner: new webpack.BannerPlugin({
                banner: "hash:[hash], chunkhash:[chunkhash], name:[name], filebase:[filebase], query:[query], file:[file]"
            }),
            commonsChunk: new webpack.optimize.CommonsChunkPlugin({
                name: "vendors",
                // filename: "vendors.js"
                // (Give the chunk a different name)
                minChunks: Infinity,
                // (with more entries, this ensures that no other module
                // goes into the vendor chunk)
            }),
            copyWebpack: new CopyWebpackPlugin([{
                from: 'src/img',
                to: 'img'
            }]),
            define: new webpack.DefinePlugin({
                env: JSON.stringify({
                    mode: options.mode,
                    development: options.development,
                    production: options.production,                
                }),
            }),
            forkChecker: new ForkCheckerPlugin(),
            noerrors: new webpack.NoErrorsPlugin(),
            splitByPath: new SplitByPathPlugin([{
                name: 'vendor',
                path: [path.join(__dirname, '../', '/node_modules/')]
            }]),
            */
            extractText: new ExtractTextPlugin(options.names.css, {
                allChunks: true
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
            hotModuleReplacement: new webpack.HotModuleReplacementPlugin(),
            htmlWebpack: new HtmlWebpackPlugin({
                template: options.src + 'index.html',
                minify: options.production,
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
            },
            sourceMapDevTool: new webpack.SourceMapDevToolPlugin({
                filename: options.names.sourceMapFilename,
                exclude: ['vendors.js', ],
            }),
            splitChunks: {
                chunks: "async",
                minSize: 30000,
                minChunks: 1,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                automaticNameDelimiter: '~',
                name: true,
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                }
            },
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
        };
        for (var p in plugins) {
            this[p] = plugins[p];
        }
    }
}

module.exports = Plugins;