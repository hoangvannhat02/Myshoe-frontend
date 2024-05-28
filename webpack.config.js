const webpack = require('webpack');
const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      "crypto": require.resolve('crypto-browserify'),
      "stream": false,
      "vm": false
    }
  }
};