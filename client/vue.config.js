const fs = require('fs');
const path = require('path');

module.exports = {
  outputDir: path.resolve(__dirname, "./dist"),
  devServer: {
    https: false,
    useLocalIp: false,
  },
  chainWebpack: config => {
    config.plugin('html')
      .tap(args => {
        args[0].title = "Papertrade";
        return args;
      });
  },
};
