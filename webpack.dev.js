const path = require('path');
const merge = require('webpack-merge');

const common = require('./webpack.common.js');

const config = {
  mode: 'development',
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx'],
  },
  optimization: {
    usedExports: true,
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  devServer: {
    compress: true,
    contentBase: path.join(__dirname, 'dist'),
    publicPath: '/js/',
    proxy: [
      {
        context: ['!/js/*.bundle.js', '**'],
        target: 'http://localhost:5000',
      },
    ],
  },
};

const clientConfig = merge(common.clientConfig, config, {});
const serverConfig = merge(common.serverConfig, config, {});

module.exports = [clientConfig, serverConfig];
