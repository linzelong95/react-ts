const os = require('os')
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const commonConfig = require('./webpack.common')
const { SERVER_ROOT, PUBLIC_ROOT, BUILD_MODULES, PROJECT_PATH, MANIFEST_ROOT } = require('./constants')

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

const manifestFlag = {}

// 开发环境manifest只需要生成一次，WebpackManifestPlugin似乎不满足需求，只能自定义
class MyManifestPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap('MyManifestPlugin', (compilation) => {
      const { outputOptions } = compilation
      for (const moduleName of BUILD_MODULES) {
        if (manifestFlag[moduleName]) continue
        const manifestFilename = `${MANIFEST_ROOT}/${moduleName}.manifest.json`
        const nextPath = `${outputOptions.publicPath}${moduleName}/js/${moduleName}.js`
        if (fs.existsSync(manifestFilename)) {
          const existedPath = require(manifestFilename)[`${moduleName}.js`].path
          if (existedPath === nextPath) continue
        }
        manifestFlag[moduleName] = true
        const output = {
          [`${moduleName}.js`]: {
            path: nextPath,
            editor: os.userInfo().username,
          },
        }
        fs.mkdirSync(path.dirname(manifestFilename), { recursive: true })
        fs.writeFileSync(manifestFilename, JSON.stringify(output, null, 2))
      }
    })
  }
}

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
      ignored: [
        'node_modules/',
        `${PROJECT_PATH}/.next/**/*`,
        `${PROJECT_PATH}/server/**/*`,
        `${PROJECT_PATH}/ssr/**/*`,
        `${PROJECT_PATH}/pages/**/*`,
      ],
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
        template: `${SERVER_ROOT}/app/view/index.ejs`,
        filename: `${moduleName}/index.html`,
        inject: 'body',
        chunks: [moduleName], // 若不设置则默认将当前entry多文件全部注入
        templateParameters: {
          title: 'briefNull project',
          keywords: 'blog,next,egg,react',
          description: 'this is a project for sharing.',
          favicon: 'http://127.0.0.1:7001/public/assets/images/logo.png',
          cssList: glob.sync(`${PUBLIC_ROOT}/base/**/*.css`, { nodir: true }).map(
            (path) => `/${path.split('/').slice(-2).join('/')}`, // '/base/css/xxx.css'
          ),
          jsList: glob.sync(`${PUBLIC_ROOT}/dll/*.js`, { nodir: true }).map(
            (path) => `/${path.split('/').slice(-2).join('/')}`, // '/dll/xxx.js', TODO:确保react、react-dom在最前面
          ),
        },
        minify:
          process.env.NODE_ENV !== 'production'
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

    new MyManifestPlugin(),

    new webpack.HotModuleReplacementPlugin(),
  ].filter(Boolean),
})
