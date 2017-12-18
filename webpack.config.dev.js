const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ReloadPlugin = require('reload-html-webpack-plugin');

const buildPath = path.resolve(__dirname, 'dist');
const extractPlugin = new ExtractTextPlugin({
  filename: './assets/css/app.css',
});

module.exports = {
  context: path.resolve(__dirname, 'src'),
  devtool: 'inline-source-map',
  devServer: {
    contentBase: 'path.resolve(__dirname, "dist")',
    hot: true,
    open: true,
    compress: true,
    port: '8080',
    host: 'localhost',
  },
  entry: {
    // with context setup, ./src/app.js -> ./app.js
    app: './app.js',
    vendors: './vendors.js',
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
            plugins: [['transform-runtime']],
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
    // auto update index.html in dist folder
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    // Enables Hot Modules Replacement
    new webpack.HotModuleReplacementPlugin(),
    // Avoid publishing files when compilation fails
    new webpack.NoEmitOnErrorsPlugin(),
    // Extract CSS Files From JS Bundle
    extractPlugin,
    // Hot Reload html
    new ReloadPlugin(),
  ],
};
