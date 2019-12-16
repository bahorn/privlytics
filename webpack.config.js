const path = require('path');

module.exports = {
  mode: 'development',
  entry: './web/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: path.join(__dirname, './web'),
    publicPath: '/assets/',
    compress: true,
    port: 9000
  }
};
