//Copied from  https://binyamin.medium.com/creating-a-node-express-webpack-app-with-dev-and-prod-builds-a4962ce51334

const path = require('path')
const nodeExternals = require('webpack-node-externals')
const HtmlWebPackPlugin = require("html-webpack-plugin")
module.exports = {
  entry: {
    server: './src/index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'index.js'
  },
  target: 'node',
  node: {
    __dirname: false,  
    __filename: false, 
  },
  externals: [nodeExternals()], 
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
}