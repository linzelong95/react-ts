// const os = require('os')
const path = require('path')
// const webpack = require('webpack')
const glob = require('glob')

const autoprefixer = require('autoprefixer')
// const ManifestPlugin = require('webpack-manifest-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const externals = require('./externals')

// 常量
const CONSTANTS = require('./constants')
const { PROJECT_PATH, BUILD_MODULES, COMMON_MODULES } = CONSTANTS

// 是否是开发环境
const isDevelopment = process.env.NODE_ENV !== 'production'

// 是否重新处理所有依赖包
const ifHandleAllLibs = process.env.IF_HANDLE_ALL_LIBS === 'all'

// 生成要编译的模块
const operatedModules = BUILD_MODULES.length
  ? BUILD_MODULES.reduce((entryObject, currentModule) => {
      entryObject[currentModule] = `./src/${currentModule}`
      return entryObject
    }, {})
  : { index: `./src/index.tsx` }

class MyInjectCustomScriptsPlugin {
  constructor(options) {
    this.options = options
  }

  // TODO:如何通过直接向webpack打包的文件区注入额外的js/css来达到目的?
  apply(compiler) {
    const { paths } = this.options
    compiler.hooks.compilation.tap('MyInjectCustomScriptsPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('MyInjectCustomScriptsPlugin', (data, callback) => {
        const scripts = paths.reduce(
          (scripts, path) => {
            if (path.endsWith('.js')) scripts.jsString += `<script src=${path}></script>`
            if (path.endsWith('.css')) scripts.cssString += `<link href=${path} rel=stylesheet />`
            return scripts
          },
          { jsString: '', cssString: '' },
        )
        const { html } = data
        const firstCssIndex = html.indexOf('<link')
        const firstScriptIndex = html.indexOf('<script')
        data.html = html.slice(0, firstScriptIndex) + scripts.jsString + html.slice(firstScriptIndex)
        data.html = data.html.slice(0, firstCssIndex) + scripts.cssString + data.html.slice(firstCssIndex)
        callback(undefined, data)
      })
    })
  }
}

module.exports = {
  // 应用入口
  entry: operatedModules,

  // 主路径
  context: path.resolve(__dirname, '../'),

  // 如果打包的是 base，externals 不被忽略
  externals: BUILD_MODULES.includes('base') || ifHandleAllLibs ? {} : externals,

  // 路径及 alias 配置
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    plugins: [
      new TsConfigPathsPlugin({
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      }),
    ],
    alias: isDevelopment
      ? {
          'react-dom': '@hot-loader/react-dom',
        }
      : {},
  },

  // loader 配置
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        enforce: 'pre',
        use: [
          {
            loader: 'eslint-loader',
            options: {
              fix: false,
              emitError: true,
            },
          },
        ],
      },
      {
        // js ts 都用 babel-loader 处理
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: { cacheDirectory: true },
          },
        ],
      },
      {
        // 不符合.global.less命名的按照模块引入组件
        test: new RegExp(`^(?!.*\\.global).*\\.less`),
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1, modules: true } },
          { loader: 'postcss-loader', options: { postcssOptions: { plugins: [autoprefixer] } } },
          { loader: 'less-loader', options: { lessOptions: { javascriptEnabled: true } } },
        ],
      },
      {
        // 符合.global.less命名的按照css引入文件
        test: new RegExp(`^(.*\\.global).*\\.less`),
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'postcss-loader', options: { postcssOptions: { plugins: [autoprefixer] } } },
          { loader: 'less-loader', options: { lessOptions: { javascriptEnabled: true } } },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', { loader: 'css-loader', options: { importLoaders: 1 } }],
      },
      // {
      //   test: /\.(jpe?g|png|gif|svg)$/i,
      //   loader: ['file-loader?hash=sha512&digest=hex&name=img/[name].[ext]&publicPath=/public'],
      // },
      // webpack 5
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'index/images/[hash][ext][query]',
        },
        // asset/resource等同file-loader，asset/inline等同url-loader，asset/source等同raw-loader
        // asset等同automatically chooses between exporting a data URI and emitting a separate file. Previously achievable by using url-loader with asset size limit
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
    ],
  },

  // 插件
  plugins: [
    ...(!BUILD_MODULES.length
      ? [
          new HtmlWebpackPlugin({
            template: path.resolve(PROJECT_PATH, './src/public/index.html'),
            filename: 'index.html',
            cache: false, // 特别重要：防止之后使用v6版本 copy-webpack-plugin 时代码修改一刷新页面为空问题。
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
          !ifHandleAllLibs &&
            new MyInjectCustomScriptsPlugin({
              paths: glob
                // TODO: 不能使用类似 {src,page}/**/*.{ts,js} 的写法？
                // .sync(`${path.resolve(PROJECT_PATH, './dist')}/{${COMMON_MODULES.join(',')}}/js/*.js`, { nodir: true })
                .sync(`${path.resolve(PROJECT_PATH, './dist')}/base/js/*.js`, { nodir: true })
                .map((pathname) => path.relative(path.resolve(PROJECT_PATH, isDevelopment ? '' : './dist'), pathname)),
            }),
        ].filter((item) => item)
      : []),

    // 带名称导出模块,webpack 5 改为optimization.moduleIds: 'named'
    // new webpack.NamedModulesPlugin(),

    // TS 类型检查
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        files: './src/**/*.{ts,tsx,js,jsx}',
      },
    }),

    // 优化错误展示，与webpack 5暂不兼容？
    new FriendlyErrorsWebpackPlugin(),

    // 进度条
    new ProgressBarPlugin(),
    // new webpack.ProgressPlugin(), // webpack自带

    // ...CONSTANTS.BUILD_MODULES.map((mdl) => {
    //   // 生成 Manifest 文件
    //   return new ManifestPlugin({
    //     fileName: path.resolve(CONSTANTS.MANIFEST_ROOT, `${mdl}.manifest.json`),
    //     writeToFileEmit: true,
    //     seed: {},

    //     // 自定义生成的对象结构
    //     generate: (seed, files) => {
    //       for (const file of files) {
    //         if (file.name === `${mdl}.js` || file.name === `${mdl}.css`) {
    //           seed[file.name] = {
    //             path: file.path,
    //             editor: os.userInfo().username,
    //             release: devMode ? undefined : CONSTANTS.RELEASE_TAG,
    //           }
    //         }
    //       }
    //       return seed
    //     },

    //     // 过滤掉 source-map
    //     filter: (file) => file.name.endsWith('.js') || file.name.endsWith('.css'),
    //   })
    // }),
  ],

  performance: {
    hints: false,
  },
}
