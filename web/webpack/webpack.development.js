const webpack = require('webpack')
const { merge } = require('webpack-merge')
const glob = require('glob')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const commonConfig = require('./webpack.common')
const { WEB_ROOT, PUBLIC_ROOT, BUILD_MODULES, ALL_MODULES } = require('./constants')

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
    // publicPath: 'http://127.0.0.1:7002/static/',
    publicPath: 'http://127.0.0.1:7002/',
    chunkFilename: (pathData) => `${pathData.chunk.runtime}/js/router/[id].js`,
    assetModuleFilename: (pathData) => `${pathData.runtime}/js/asset/[name][ext][query]`,
  },

  devtool: 'eval-cheap-module-source-map',
  // watch: true, // devServer默认启动
  // target: 'web', // 默认
  devServer: {
    port: 7002,
    host: '127.0.0.1', // '0.0.0.0',允许局域网中其他设备访问本地服务
    // publicPath: '/static/',
    publicPath: '/',
    hot: true, // 尝试热替换，失败则尝试热更新
    // hotOnly: true, // 只允许热替换
    injectHot: true,
    open: true, // 打开默认浏览器
    progress: true, // 显示进度
    compress: true, // 是否启用 gzip 压缩
    stats: 'errors-only', // 只在发生错误时输出
    clientLogLevel: 'silent', // 日志等级
    disableHostCheck: true,
    // 如果devServer.publicPath不设置但output.publicPath为/additional-path/,这里需要修改为：{index:'/additional-path/'}
    // historyApiFallback: true,
    historyApiFallback: {
      rewrites: BUILD_MODULES.map((moduleName) => {
        const regExp = new RegExp(`^\\/${moduleName}(\\/.*)*`)
        return { from: regExp, to: `/${moduleName}` }
      }),
    },
    openPage: BUILD_MODULES,
    watchOptions: {
      poll: true,
      aggregateTimeout: 0,
      ignored: ALL_MODULES.map((moduleName) =>
        BUILD_MODULES.includes(moduleName) || moduleName === 'common' ? null : `**/${moduleName}/**`,
      ).filter(Boolean),
    },
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:7001/',
        // 该配置只是让后端读取request.getHeader("Host")是代理后的地址，但在浏览器控制面板还是显示源请求
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
    // 复制
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(PUBLIC_ROOT, './base'), to: '/base' }],
    }),

    ...BUILD_MODULES.map((moduleName) => {
      if (moduleName === 'base') return null
      return new HtmlWebpackPlugin({
        template: path.resolve(WEB_ROOT, './src/template.ejs'),
        filename: `${moduleName}/index.html`,
        inject: 'body',
        scriptLoading: 'blocking',
        templateParameters: {
          favicon: 'http://127.0.0.1:7001/public/assets/images/logo.png',
          scripts: glob.sync(`${path.resolve(PUBLIC_ROOT, './base')}/**/*{.css,.js}`, { nodir: true }).reduce(
            (scripts, path) => {
              // const validPaths = path.split('/').slice(-2)
              // const file = `http://127.0.0.1:7001/public/base/${validPaths.join('/')}`
              const file = `/${path.split('/').slice(-3).join('/')}`
              if (file.endsWith('.js')) {
                if (!ifHandleAllLibs) scripts.jsList.push(file)
              } else {
                scripts.cssList.push(file)
              }
              return scripts
            },
            { cssList: [], jsList: [] },
          ),
        },
        chunks: [moduleName], // 若不设置则默认将当前entry多文件全部注入
        // chunksSortMode:'manual',//不设置时，默认顺序以entry的顺序
        // excludeChunks:[],// 拒绝当前打包的入口文件的某些注入到html中，默认不排除
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
      })
    }),
    new webpack.HotModuleReplacementPlugin(),
  ].filter(Boolean),
})
