/* jshint esversion: 6, node: true */

'use strict';

const path = require('path');
const webpack = require('webpack'); // to access built-in plugins
const HtmlWebpackPlugin = require('html-webpack-plugin'); // installed via npm
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');

const json = require('./webpack.json');
console.log('json', json.entry);

const mode = process.env.NODE_ENV;
const production = mode === 'production';
const development = mode === 'development';

const sassPlugin = new ExtractTextPlugin({
    filename: 'css/[name].css',
});

const sassRule = {
    test: /\.(css|sass|scss)$/,
    use: sassPlugin.extract({
        fallback: 'style-loader',
        // use: 'css-loader!sass-loader',
        use: [{
                loader: "css-loader", // translates CSS into CommonJS
                options: {
                    sourceMap: true
                }
            },
            /* {
                loader: 'postcss-loader', // Run post css actions
                options: {
                    plugins: function () { // post css plugins, can be exported to postcss.config.js
                        return [
                            // require('precss'),
                            require('autoprefixer')
                        ];
                    },
                    sourceMap: true
                }
            }, */
            {
                loader: 'sass-loader', // compiles Sass to CSS
                options: {
                    sourceMap: true
                }
            },
        ],
        // use style-loader in development
        // fallback: "style-loader",
    }),
    exclude: /\.(eot|woff|woff2|ttf|svg)(\?[\s\S]+)?$/,
};

const cssUrlResolver = {
    test: /\.css$/,
    use: ['style-loader', 'css-loader', 'resolve-url-loader']
};

const sassUrlResolver = {
    test: /\.(sass|scss)$/,
    use: ['style-loader', 'css-loader', 'resolve-url-loader', 'sass-loader?sourceMap']
};

const config = {
    entry: {
        style: './src/scss/app.scss',
        vendors: './src/vendors/vendors.js',
        app: './src/app/app.js',
    },
    output: {
        path: path.resolve(__dirname, 'docs'),
        publicPath: '/',
        filename: development ? '[name].js' : '[name].[hash].js',
        sourceMapFilename: development ? '[name].js.map' : '[name].[hash].js.map',
        chunkFilename: development ? '[name].js' : '[name].chunk.[hash].js',
    },
    devtool: development ? 'inline-source-map' : 'source-map',
    mode: mode,
    resolve: {
        extensions: ['.js', '.scss'],
        alias: {
            jquery: "jquery/src/jquery"
        }
    },
    module: {
        rules: [
            sassRule,
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                exclude: /node_modules/,
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
                        useRelativePath: true,
                        name: 'fonts/[name].[ext]',
                    }
                }]
            }, {
                test: /\.(svg|jpg|jpeg|gif|png)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10240,
                        fallback: 'file-loader',
                    }
                }, {
                    loader: 'file-loader',
                    options: {
                        useRelativePath: true,
                        name: 'img/[name].[ext]',
                    }
                }]
            }, {
                test: /\.txt$/,
                use: 'raw-loader'
            }
        ]
    },
    devServer: {
        open: true, // will open the browser
        hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
        inline: true, // inline module replacement.
        noInfo: true, // only errors & warns on hot reload
        contentBase: path.join(__dirname, 'docs'), // boolean | string | array, static file location
        compress: true, // enable gzip compression
        port: 9000,
        historyApiFallback: true, // true for index.html upon 404, object for multiple paths
        https: false, // true for self-signed, object for cert authority
        proxy: { // proxy URLs to backend development server
            '/api': 'http://localhost:3000'
        },
        // ...
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: '[name].js.map',
            exclude: ['vendors.js']
        }),
        sassPlugin,
    ],
    optimization: {
        minimizer: [
            // we specify a custom UglifyJsPlugin here to get source maps in production
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    compress: false,
                    ecma: 5,
                    mangle: true
                },
                sourceMap: true
            })
        ]
    }
    /*
    noParse: [
        /[\/\\]node_modules[\/\\]angular[\/\\]angular\.js$/
    ]
    */
};

/*
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
*/

module.exports = config;