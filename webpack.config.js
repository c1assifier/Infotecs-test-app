const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const loadDotEnv = (envPath) => {
  if (!fs.existsSync(envPath)) {
    return {};
  }

  const raw = fs.readFileSync(envPath, 'utf8');
  const result = {};

  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^"(.*)"$/, '$1');

    if (key) {
      result[key] = value;
    }
  }

  return result;
};

const dotEnv = loadDotEnv(path.resolve(__dirname, '.env'));
const API_BASE_URL = process.env.API_BASE_URL ?? dotEnv.API_BASE_URL ?? '';

if (!API_BASE_URL) {
  throw new Error('Missing API_BASE_URL. Set it in .env (API_BASE_URL=...) or in process env.');
}

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new webpack.DefinePlugin({
      __API_BASE_URL__: JSON.stringify(API_BASE_URL)
    })
  ],
  devServer: {
    port: 3000,
    open: true,
    historyApiFallback: true
  }
};
