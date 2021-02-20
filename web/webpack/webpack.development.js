const webpack = require('webpack')
const { merge } = require('webpack-merge')
const glob = require('glob')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const commonConfig = require('./webpack.common')
const CONSTANTS = require('./constants')
const { WEB_ROOT, PUBLIC_ROOT, BUILD_MODULES } = CONSTANTS

// class MyInjectCustomScriptsPlugin {
//   constructor(options) {
//     this.options = options
//   }

//   // TODO:如何通过直接向webpack打包的文件区注入额外的js/css来达到目的?
//   apply(compiler) {
//     const { paths } = this.options
//     compiler.hooks.compilation.tap('MyInjectCustomScriptsPlugin', (compilation) => {
//       HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('MyInjectCustomScriptsPlugin', (data, callback) => {
//         const scripts = paths.reduce(
//           (scripts, path) => {
//             if (path.endsWith('.js')) scripts.jsString += `<script src=${path}></script>`
//             if (path.endsWith('.css')) scripts.cssString += `<link href=${path} rel=stylesheet />`
//             return scripts
//           },
//           { jsString: '', cssString: '' },
//         )
//         const { html } = data
//         const firstCssIndex = html.indexOf('<link')
//         const firstScriptIndex = html.indexOf('<script')
//         data.html = html.slice(0, firstScriptIndex) + scripts.jsString + html.slice(firstScriptIndex)
//         data.html = data.html.slice(0, firstCssIndex) + scripts.cssString + data.html.slice(firstCssIndex)
//         callback(undefined, data)
//       })
//     })
//   }
// }

// 是否是开发环境
const isDevelopment = process.env.NODE_ENV !== 'production'
// 是否重新处理所有依赖包
const ifHandleAllLibs = process.env.IF_HANDLE_ALL_LIBS === 'all'

module.exports = merge(commonConfig, {
  mode: 'development',

  output: {
    path: '/',
    filename: '[name]/js/[name].js',
    // publicPath: 'http://127.0.0.1:7002/dev-static/',
    publicPath: 'http://127.0.0.1:7002/',
    chunkFilename: (pathData) => `${pathData.chunk.runtime}/js/router/[id].js`,
    assetModuleFilename: (pathData) => `${pathData.runtime}/js/asset/[name][ext][query]`,
  },

  // DEV 配置
  devtool: 'eval-cheap-module-source-map',
  watch: true,
  target: 'web',
  devServer: {
    port: 7002,
    // publicPath: '/dev-static/',
    publicPath: '/',
    hot: true, // 热更新
    open: true, // 打开默认浏览器
    compress: true, // 是否启用 gzip 压缩
    // stats: 'errors-only', // 终端仅打印 error
    clientLogLevel: 'silent', // 日志等级
    disableHostCheck: true,
    quiet: true,
    // 如果devServer.publicPath不设置但output.publicPath为/additional-path/,这里需要修改为：{index:'/additional-path/'}
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

  plugins: [
    !BUILD_MODULES.includes('base') &&
      new HtmlWebpackPlugin({
        template: path.resolve(WEB_ROOT, './src/index.dev.ejs'),
        filename: 'index.html',
        cache: false, // 特别重要：防止之后使用v6版本 copy-webpack-plugin 时代码修改一刷新页面为空问题。
        templateParameters: {
          favicon: 'http://127.0.0.1:7001/public/assets/images/logo.png',
          scripts:
            !ifHandleAllLibs &&
            glob.sync(`${path.resolve(PUBLIC_ROOT, './base')}/**/*{.css,.js}`, { nodir: true }).reduce(
              (scripts, path) => {
                const validPaths = path.split('/').slice(-2)
                const file = `http://127.0.0.1:7001/public/base/${validPaths.join('/')}`
                if (file.endsWith('.js')) {
                  scripts.jsList.push(file)
                } else {
                  scripts.cssList.push(file)
                }
                return scripts
              },
              { cssList: [], jsList: [] },
            ),
        },
        minify: isDevelopment
          ? false
          : {
              removeAttributeQuotes: true,
              collapseWhitespace: true,
              removeComments: true,
              collapseBooleanAttributes: true,
              collapseInlineTagWhitespace: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              minifyCSS: true,
              minifyJS: true,
              minifyURLs: true,
              useShortDoctype: true,
            },
      }),

    new webpack.HotModuleReplacementPlugin(),
  ].filter(Boolean),
})
