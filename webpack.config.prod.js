const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const buildPath = path.resolve(__dirname, 'dist');
const extractPlugin = new ExtractTextPlugin({
  filename: './assets/css/app.css',
});

module.exports = {
  context: path.resolve(__dirname, 'src'),
  devtool: 'inline-source-map',
  entry: {
    // with context setup, ./src/app.js -> ./app.js
    app: './app.js',
    vendors: './vendors.js',
    polyfill: 'babel-polyfill',
  },
  output: {
    path: buildPath,
    filename: './assets/js/[name].bundle.js',
  },
  module: {
    rules: [
      // babel-loader
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          },
        },
      },
      // html-loader
      { test: /\.html$/, use: ['html-loader'] },
      // sass-loader
      {
        test: /\.scss$/,
        include: [path.resolve(__dirname, 'src', 'assets', 'scss')],
        use: extractPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
          fallback: 'style-loader',
        }),
      },
      // Media Files Loader
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: './assets/media/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // clear old build folder before building
    new CleanWebpackPlugin(['dist']),
    // auto update index.html in dist folder
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new UglifyJsPlugin({
      sourceMap: true,
    }),
    // Extract CSS Files From JS Bundle
    extractPlugin,
  ],
};
