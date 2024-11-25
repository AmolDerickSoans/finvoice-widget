const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtReloader = require('webpack-ext-reloader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    popup: ['./styles/tailwind.css', './popup/popup.js'],
    background: './background/background.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ['@babel/plugin-transform-react-jsx', { pragma: 'h', pragmaFrag: 'Fragment' }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'react': 'preact/compat',
      'react-dom': 'preact/compat',
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './popup/index.html',
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'manifest.json',
          to: 'manifest.json',
          transform(content) {
            return Buffer.from(JSON.stringify({
              ...JSON.parse(content.toString()),
              version: process.env.npm_package_version
            }))
          }
        },
        {
          from: 'src/assets',
          to: 'assets'
        }
      ]
    }),
    new ExtReloader({
      port: 9090,
      reloadPage: true,
      entries: {
        background: 'background',
        extensionPage: ['popup']
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],

  devtool: 'cheap-module-source-map'
};