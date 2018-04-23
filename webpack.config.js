/* jshint esversion: 6, node: true */

'use strict';

// requires
const path = require('path');
const webpack = require('webpack'); // to access built-in plugins
const HtmlWebpackPlugin = require('html-webpack-plugin'); // installed via npm
const StyleLintPlugin = require('stylelint-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');

// configuration
const json = require('./webpack.json');
const src = './src/';
const dist = path.join(__dirname, 'docs');
const mode = process.argv.indexOf('-p') !== -1 ? 'production' : 'development';
const production = mode === 'production';
const development = mode === 'development';
console.log(process.argv, 'mode', mode, 'production', production, 'development', development, 'json', json.entry);

// plugins
const sassPlugin = new ExtractTextPlugin(development ? 'css/[name].css' : 'css/[name].[hash].css', {
    allChunks: true
});

const sassRule = {
    test: /\.(css|sass|scss)$/,
    use: sassPlugin.extract({
        fallback: 'style-loader',
        // use: 'css-loader!sass-loader',
        use: [{
                loader: "css-loader", // translates CSS into CommonJS
                options: {
                    sourceMap: !production,
                    minimize: production,
                }
            },
            {
                loader: 'postcss-loader',
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
            'resolve-url-loader',
            {
                loader: 'sass-loader', // compiles Sass to CSS
                options: {
                    sourceMap: !production,
                    minimize: production,
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
        style: src + 'scss/app.scss',
        vendors: src + 'vendors/vendors.js',
        app: src + 'app/app.js',
    },
    output: {
        path: dist,
        publicPath: '/',
        filename: development ? 'js/[name].js' : 'js/[name].[hash].js',
        sourceMapFilename: development ? 'js/[name].js.map' : 'js/[name].[hash].js.map',
        chunkFilename: development ? 'js/[name].js' : 'js/[name].[hash].js',
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
                    loader: 'file-loader',
                    options: {
                        useRelativePath: true,
                        name: 'fonts/[name].[ext]',
                    }
                }, {
                    loader: 'url-loader',
                    options: {
                        limit: 10240,
                        mimetype: 'application/octet-stream',
                        fallback: 'file-loader',
                    }
                }]
            }, {
                test: /\.(svg|jpg|jpeg|gif|png)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        useRelativePath: true,
                        name: 'img/[name].[ext]',
                    }
                }, {
                    loader: 'url-loader',
                    options: {
                        limit: 10240,
                        fallback: 'file-loader',
                    }
                }]
            }, {
                test: /\.txt$/,
                use: 'raw-loader'
            }
        ]
        /*
        loaders.ts,
        loaders.js,
        loaders.html,
        process.env.NODE_ENV === 'production' ? loaders.scssprod : loaders.scssdev,
        loaders.fonts,
        */
    },
    devServer: {
        open: true, // will open the browser
        hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
        inline: true, // inline module replacement.
        noInfo: true, // only errors & warns on hot reload
        contentBase: dist, // boolean | string | array, static file location
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
            template: src + 'index.html',
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: development ? 'js/[name].js.map' : 'js/[name].[hash].js.map',
            exclude: ['vendors.js'],
        }),
        /*
        new StyleLintPlugin({
            emitErrors: true,
            failOnError: false,
            syntax: 'scss',
        }),
        */
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
                    mangle: true,
                    output: {
                        comments: false,
                        beautify: false,
                    }
                },
                sourceMap: false
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