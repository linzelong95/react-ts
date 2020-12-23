const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 找到没有用到的废弃文件
// const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin')
// const CONSTANTS = require('./constants')

const commonConfig = require('./webpack.common')

module.exports = merge(commonConfig, {
  mode: 'development',

  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, '../dist'),
  },

  // DEV 配置
  devtool: 'eval-cheap-module-source-map',
  watch: true,
  target: 'web',
  devServer: {
    port: 9000,
    hot: true, // 热更新
    open: true, // 打开默认浏览器
    compress: true, // 是否启用 gzip 压缩
    // stats: 'errors-only', // 终端仅打印 error
    clientLogLevel: 'silent', // 日志等级
    disableHostCheck: true,
    quiet: true,
    historyApiFallback: { disableDotRule: true },
    watchOptions: {
      poll: true,
    },
    proxy: {
      '/api': {
        target: 'http://local.lceda.cn/',
        changeOrigin: true,
        pathRewrite: {
          '^/': '',
        },
      },
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },

  // 插件
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    // new UnusedFilesWebpackPlugin({
    //   failOnUnused: true,
    //   patterns: ['./src/**/*.*'],
    // }),
    new webpack.HotModuleReplacementPlugin(),
  ],
})
