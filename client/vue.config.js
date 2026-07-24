const path = require('path');

process.env.VUE_APP_API_URL =
  process.env.VUE_APP_API_URL ||
  process.env.API_URL ||
  'http://localhost:9090/';

module.exports = {
  outputDir: path.resolve(__dirname, "./dist"),
  productionSourceMap: false,
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
