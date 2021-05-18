const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
// const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const { PROJECT_PATH, WEB_ROOT, BUILD_MODULES } = require('./constants')

const externals = require('./externals')

// 是否是开发环境
const isDevelopment = process.env.NODE_ENV !== 'production'

module.exports = {
  // 应用入口
  entry: BUILD_MODULES.reduce((entryObject, currentModule) => {
    entryObject[currentModule] = `${WEB_ROOT}/spa/${currentModule}`
    return entryObject
  }, {}),

  // 主路径
  context: PROJECT_PATH,

  // 如果打包的是 base，externals 不被忽略
  externals: BUILD_MODULES.includes('base') || isDevelopment ? {} : externals,

  // 路径及 alias 配置
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    plugins: [
      new TsConfigPathsPlugin({
        baseUrl: PROJECT_PATH,
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
      : {
          'bn.js': path.resolve(PROJECT_PATH, 'node_modules', 'bn.js'), // 避免重复打包
        },
  },

  // loader 配置
  module: {
    rules: [
      // ForkTsCheckerWebpackPlugin里做校验就可以了
      // {
      //   test: /\.tsx?$/,
      //   enforce: 'pre',
      //   use: [
      //     {
      //       loader: 'eslint-loader',
      //       options: {
      //         fix: false,
      //         emitError: true,
      //       },
      //     },
      //   ],
      // },
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
        // 加了module字样，按照模块引入组件
        test: new RegExp(`^(.*\\.module).*\\.less`),
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1, modules: true } },
          { loader: 'postcss-loader', options: { postcssOptions: { plugins: [autoprefixer] } } },
          { loader: 'less-loader', options: { lessOptions: { javascriptEnabled: true } } },
        ],
      },
      {
        // 不包含module字样，全局引入
        test: new RegExp(`^(?!.*\\.module).*\\.less`),
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'postcss-loader', options: { postcssOptions: { plugins: [autoprefixer] } } },
          { loader: 'less-loader', options: { lessOptions: { javascriptEnabled: true } } },
        ],
      },
      {
        // 不包含module字样，全局引入
        test: new RegExp(`^(?!.*\\.module).*\\.scss`),
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'postcss-loader', options: { postcssOptions: { plugins: [autoprefixer] } } },
          { loader: 'sass-loader', options: { sassOptions: { javascriptEnabled: true } } },
        ],
      },
      {
        // 加了module字样，按照模块引入组件
        test: new RegExp(`^(.*\\.module).*\\.scss`),
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1, modules: true } },
          { loader: 'postcss-loader', options: { postcssOptions: { plugins: [autoprefixer] } } },
          { loader: 'sass-loader', options: { sassOptions: { javascriptEnabled: true } } },
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
    //   _: 'lodash',
    // }),

    // 约定全局常量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __SERVER_ORIGIN__: JSON.stringify(isDevelopment ? 'http://127.0.0.1:7001' : ''),
      __IS_DEV_MODE__: JSON.stringify(process.env.NODE_ENV === 'development'),
    }),

    // 优化错误展示，与webpack 5暂不兼容？
    // new FriendlyErrorsWebpackPlugin(),

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
  ],

  performance: {
    hints: false,
  },
}
