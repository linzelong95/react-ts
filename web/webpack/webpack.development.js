const webpack = require('webpack')
const { merge } = require('webpack-merge')
const glob = require('glob')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const commonConfig = require('./webpack.common')
const { WEB_ROOT, PUBLIC_ROOT, BUILD_MODULES, ALL_MODULES } = require('./constants')

// class MyInjectCustomScriptsPlugin {
//   constructor(options) {
//     this.options = options
//   }

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
  watch: true, // devServer默认启动
  target: 'web', // 默认
  devServer: {
    port: 7002,
    host: '127.0.0.1', // '0.0.0.0',允许局域网中其他设备访问本地服务
    // publicPath: '/static/',
    publicPath: '/',
    hot: true, // 尝试热替换，失败则尝试热更新
    // hotOnly: true, // 只允许热替换
    open: true, // 打开默认浏览器
    // progress: true, // 显示进度
    compress: true, // 是否启用 gzip 压缩
    stats: 'errors-only', // 只在发生错误时输出
    clientLogLevel: 'silent', // 日志等级
    quiet: true,
    // disableHostCheck: true,
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
      aggregateTimeout: 100,
      ignored: ALL_MODULES.map((moduleName) =>
        BUILD_MODULES.includes(moduleName) || moduleName === 'common' ? null : `**/${moduleName}/**`,
      ).filter(Boolean),
    },
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:7001/',
        changeOrigin: true, // 该配置只是让后端读取request.getHeader("Host")是代理后的地址，但在浏览器控制面板还是显示源请求
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
    ...glob.sync(`${PUBLIC_ROOT}/dll/*.json`, { nodir: true }).map((path) => {
      return new webpack.DllReferencePlugin({
        manifest: require(path),
      })
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: `${PUBLIC_ROOT}/base`, to: '/base' },
        ...glob.sync(`${PUBLIC_ROOT}/dll/*.js`, { nodir: true }).map((from) => {
          return { from, to: '/dll' }
        }),
      ],
    }),

    ...BUILD_MODULES.map((moduleName) => {
      if (moduleName === 'base') return null
      return new HtmlWebpackPlugin({
        template: `${WEB_ROOT}/src/template.ejs`,
        filename: `${moduleName}/index.html`,
        inject: 'body',
        chunks: [moduleName], // 若不设置则默认将当前entry多文件全部注入
        templateParameters: {
          favicon: 'http://127.0.0.1:7001/public/assets/images/logo.png',
          cssList: glob.sync(`${PUBLIC_ROOT}/base/**/*.css`, { nodir: true }).map(
            (path) => `/${path.split('/').slice(-3).join('/')}`, // '/base/css/xxx.css'
          ),
          jsList: glob.sync(`${PUBLIC_ROOT}/dll/*.js`, { nodir: true }).map(
            (path) => `/${path.split('/').slice(-2).join('/')}`, // '/dll/xxx.js', TODO:确保react、react-dom在最前面
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
      })
    }),

    new webpack.HotModuleReplacementPlugin(),
  ].filter(Boolean),
})
