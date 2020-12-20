// 必要的参数检查
// if (!process.env.BUILD_MODULES) {
//   throw new Error('必须要添加要编译的 app 名，例如 npm run dev index 或 npm run build index')
// }

// const os = require('os')
const path = require('path')
const webpack = require('webpack')

const autoprefixer = require('autoprefixer')
// const ManifestPlugin = require('webpack-manifest-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

// 常量
const CONSTANTS = require('./constants')
const { PROJECT_PATH } = CONSTANTS
const externals = require('./externals')

// 环境
const isDevelopment = process.env.NODE_ENV !== 'production'

// 生成要编译的模块
// const entry = CONSTANTS.BUILD_MODULES.reduce((entryObject, currentModule) => {
//   entryObject[currentModule] = `./src/${currentModule}`
//   return entryObject
// }, {})

// 如果打包的是 base，externals 不被忽略
// if (CONSTANTS.BUILD_MODULES.includes('base')) {
//   externals = {}
// }

module.exports = {
  // 应用入口
  entry: './src',

  // 主路径
  context: path.resolve(__dirname, '../'),

  // 路径及 alias 配置
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.less'],
    plugins: [
      new TsConfigPathsPlugin({
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.less'],
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
              // fix: true, // 不要自动fix
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
          { loader: 'less-loader' },
        ],
      },
      {
        // 符合.global.less命名的按照css引入文件
        test: new RegExp(`^(.*\\.global).*\\.less`),
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'postcss-loader', options: { postcssOptions: { plugins: [autoprefixer] } } },
          { loader: 'less-loader' },
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
    new MiniCssExtractPlugin(),
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

    // 带名称导出模块,webpack 5 改为optimization.moduleIds: 'named'
    // new webpack.NamedModulesPlugin(),

    // TS 类型检查
    // new ForkTsCheckerWebpackPlugin({
    //   reportFiles: ['./src/**/*.{ts,tsx}'],
    //   tsconfig: './tsconfig.json',
    // }),
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        files: './src/**/*.{ts,tsx,js,jsx}',
      },
    }),

    // 优化错误展示
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

  externals,

  performance: {
    hints: false,
  },
}
