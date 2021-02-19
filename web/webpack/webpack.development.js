const webpack = require('webpack')
const { merge } = require('webpack-merge')

const commonConfig = require('./webpack.common')

module.exports = merge(commonConfig, {
  mode: 'development',

  output: {
    path: '/',
    filename: '[name]/js/[name].js',
    publicPath: 'http://127.0.0.1:7002/dev-static/',
    chunkFilename: (pathData) => `${pathData.chunk.runtime}/js/router/[id].js`,
    assetModuleFilename: (pathData) => `${pathData.runtime}/js/asset/[name][ext][query]`,
  },

  // DEV 配置
  devtool: 'eval-cheap-module-source-map',
  watch: true,
  target: 'web',
  devServer: {
    port: 7002,
    publicPath: '/dev-static/',
    hot: true, // 热更新
    open: false, // 打开默认浏览器
    compress: true, // 是否启用 gzip 压缩
    // stats: 'errors-only', // 终端仅打印 error
    clientLogLevel: 'silent', // 日志等级
    disableHostCheck: true,
    quiet: true,
    // 如果修改了output.publicPath:/additional-path/,需要修改为：{index:'/additional-path/'}
    historyApiFallback: true,
    watchOptions: {
      poll: true,
    },
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:7001/',
        changeOrigin: true,
        // pathRewrite: {
        //   '^/api': '',
        // },
        secure: false,
      },
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },

  // 插件
  plugins: [new webpack.HotModuleReplacementPlugin()],
})
