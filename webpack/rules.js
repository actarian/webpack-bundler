/* jshint esversion: 6, node: true */

'use strict';

class Rules {
    constructor(options, plugins) {
        let rules = {
            fonts: {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10240,
                        mimetype: 'application/octet-stream',
                        fallback: 'file-loader',
                        useRelativePath: false,
                        name: function (path) {
                            return options.getName(path, options.names.fonts);
                        },
                    }
                }]
            },
            html: {
                test: /\.(html)$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        attrs: [':data-src', 'img:src', 'link:href'], //, 'meta:content'
                        minimize: options.production ? {
                            removeAttributeQuotes: true,
                            collapseWhitespace: true,
                            html5: true,
                            minifyCSS: true,
                            removeComments: true,
                            removeEmptyAttributes: true,
                        } : false,
                        interpolate: true,
                    }
                }]
            },
            images: {
                test: /\.(jpg|jpeg|gif|png)$/,
                use: [
                    /* {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: 'file-loader',
                            useRelativePath: false,
                            name: function (path) {
                                return options.getName(path, options.names.images);
                            },
                        }
                    }, */
                    {
                        loader: 'file-loader',
                        options: {
                            useRelativePath: false,
                            name: function (path) {
                                return options.getName(path, options.names.images);
                            },
                        }
                    }, {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65,
                            },
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4,
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            webp: {
                                quality: 75,
                            },
                        }
                    }
                ]
            },
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
                                sourceMap: true,
                                url: true,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: plugins.postCss,
                        },
                        {
                            loader: 'resolve-url-loader',
                            options: {
                                debug: false,
                                keepQuery: true,
                                sourceMap: true,
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                // minimize: options.production,
                                sourceMap: true,
                            }
                        },
                    ],
                }),
                // exclude: /\.(eot|woff|woff2|ttf|svg)(\?[\s\S]+)?$/,
            },
            typescript: {
                test: /\.(ts)$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        // transpileOnly: false,
                        logInfoToStdOut: true,
                        // logLevel: 'warn',
                        // silent: false,
                        // compiler: 'typescript',
                        // configFile: 'tsconfig.json',
                    }
                }]
            }
        };
        for (var p in rules) {
            this[p] = rules[p];
        }
    }
}

module.exports = Rules;