const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.jsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: { extensions: ['.js', '.jsx'] },
  module: {
    rules: [
      { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ },
      { 
        test: /\.css$/, 
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'public', 'index.html') }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
          to: path.resolve(__dirname, 'dist'),
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
  ],
  devServer: { 
    historyApiFallback: true, 
    port: 3000,
    proxy: [{ context: ['/api'], target: 'http://localhost:6000' }],
  },
};
