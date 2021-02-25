const os = require('os')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const { WEB_ROOT, BUILD_MODULES, MANIFEST_ROOT, RELEASE_TAG } = require('./constants')

const externals = require('./externals')

// 是否是开发环境
const isDevelopment = process.env.NODE_ENV !== 'production'

// 是否重新处理所有依赖包
const ifHandleAllLibs = process.env.IF_HANDLE_ALL_LIBS === 'all'

module.exports = {
  // 应用入口
  entry: BUILD_MODULES.reduce((entryObject, currentModule) => {
    entryObject[currentModule] = `${WEB_ROOT}/src/${currentModule}`
    return entryObject
  }, {}),

  // 主路径
  context: WEB_ROOT,

  // 如果打包的是 base，externals 不被忽略
  externals: BUILD_MODULES.includes('base') || ifHandleAllLibs ? {} : externals,

  // 路径及 alias 配置
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    plugins: [
      new TsConfigPathsPlugin({
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
      }),
    ],
    // 解决：BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      buffer: require.resolve('buffer/'),
      stream: require.resolve('stream-browserify'),
    },
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
        test: /\.js$/,
        include: /node_modules\/react-dom/,
        use: ['react-hot-loader/webpack'],
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
        use: [isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader, { loader: 'css-loader', options: { importLoaders: 1 } }],
      },
      // {
      //   test: /\.(jpe?g|png|gif|svg)$/i,
      //   loader: ['file-loader?hash=sha512&digest=hex&name=img/[name].[ext]&publicPath=/public'],
      // },
      // webpack 5
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
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
    // 约定全局变量，页面上直接使用，不需要import，.eslintrc.js的globals属性需要做相应配置{_:'readonly'}
    // new webpack.ProvidePlugin({
    //   _:'lodash'
    // }),

    // TS 类型检查
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        files: './src/**/*.{ts,tsx}',
      },
    }),

    // 优化错误展示，与webpack 5暂不兼容？
    new FriendlyErrorsWebpackPlugin(),

    // 带名称导出模块,webpack 5 改为optimization.moduleIds: 'named'
    // new webpack.NamedModulesPlugin(),

    // 忽略模块中的某些内容，比如忽略/moment/locale下的所有文件，在页面需要自行导入所需要的，如import 'moment/locale/zh-cn';
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    // 提取模块其中的一部分，在页面就不需要特地导入所需要的，如不需要特地import 'moment/locale/zh-cn';
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),

    // 进度条
    new ProgressBarPlugin(),
    // new webpack.ProgressPlugin(), // webpack自带

    // 提高打包速度，webpack v5 报错
    // new HardSourceWebpackPlugin(),

    ...BUILD_MODULES.map((mdl) => {
      return new WebpackManifestPlugin({
        fileName: `${MANIFEST_ROOT}/${mdl}.manifest.json`,
        writeToFileEmit: true,
        seed: {},
        generate: (seed, files) => {
          for (const file of files) {
            const { name, path } = file
            if (name === `${mdl}.js` || name === `${mdl}.css`) {
              seed[name] = {
                path,
                editor: os.userInfo().username,
                release: isDevelopment ? undefined : RELEASE_TAG,
              }
            }
          }
          return seed
        },
        filter: (file) => /\.(js|css)$/.test(file.name),
      })
    }),
  ],

  performance: {
    hints: false,
  },
}
