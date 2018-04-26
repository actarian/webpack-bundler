/* jshint esversion: 6, node: true */

'use strict';

class Rules {
    constructor(options, plugins) {
        let rules = {
            sass: {
                test: /\.(css|sass|scss)$/,
                use: plugins.extractText.extract({
                    fallback: 'style-loader',
                    use: [{
                            loader: "css-loader", // translates CSS into CommonJS
                            options: {
                                discardComments: {
                                    removeAll: true,
                                },
                                importLoaders: 1,
                                minimize: options.production ? {
                                    discardComments: {
                                        removeAll: true,
                                    },
                                } : false,
                                sourceMap: true, // !options.production,
                                url: true,
                            },
                        },
                        {
                            loader: 'postcss-loader', // post css actions
                            options: plugins.postCss,
                        },
                        {
                            loader: 'resolve-url-loader', // resolve url() assets resources
                            options: {
                                sourceMap: true, // !options.production,
                                keepQuery: true,
                                debug: true,
                            }
                        },
                        {
                            loader: 'sass-loader', // compiles scss to css
                            options: {
                                sourceMap: true, // !options.production,
                                minimize: options.production,
                            }
                        },
                    ],
                }),
                // exclude: /\.(eot|woff|woff2|ttf|svg)(\?[\s\S]+)?$/,
            },
            images: {
                test: /\.(jpg|jpeg|gif|png)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10240,
                        fallback: 'file-loader',
                    }
                }, {
                    loader: 'file-loader',
                    options: {
                        useRelativePath: false,
                        name: function (path) {
                            return options.getName(path, options.names.images);
                        },
                    }
                }]
            },
            fonts: {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10240,
                        mimetype: 'application/octet-stream',
                        fallback: 'file-loader',
                    }
                }, {
                    loader: 'file-loader',
                    options: {
                        useRelativePath: false,
                        name: function (path) {
                            return options.getName(path, options.names.fonts);
                        },
                    }
                }]
            },
        };
        for (var p in rules) {
            this[p] = rules[p];
        }
    }
}

module.exports = Rules;