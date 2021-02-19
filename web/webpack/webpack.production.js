const { merge } = require('webpack-merge')
const glob = require('glob')
const path = require('path')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
const PurgeCSSPlugin = require('purgecss-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const SentryPlugin = require('webpack-sentry-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
// 找到没有用到的废弃文件
// const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// 测速插件，webpack 5暂不支持
// const smp = new SpeedMeasurePlugin()

// configs
const commonConfig = require('./webpack.common')

// 常量
const CONSTANTS = require('./constants')
const { PROJECT_PATH, BUILD_MODULES, PUBLIC_ROOT } = CONSTANTS

const productionConfig = {
  mode: 'production',

  output: {
    filename: '[name]/js/[name].[contenthash:8].js',
    path: PUBLIC_ROOT,
    publicPath: '/public/',
    chunkFilename: (pathData) => `${pathData.chunk.runtime}/js/router/[id].js`,
    assetModuleFilename: (pathData) => `${pathData.runtime}/js/asset/[name]-[hash][ext][query]`,
  },

  devtool: 'source-map',

  optimization: {
    // 本项目并没有真正意义上的多入口，并且常用的公共依赖模块已抽离到base中
    // splitChunks: {
    //   chunks: 'all',
    // },
    splitChunks: false,
    minimize: true,
    // webpack v5自带了TerserPlugin，这里可以不用配置
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          safari10: true,
          compress: { pure_funcs: ['console.log'] },
        },
        extractComments: false,
      }),
      new OptimizeCSSAssetsPlugin(),
    ],
  },

  plugins: [
    // 抽离出css
    new MiniCssExtractPlugin({
      filename: '[name]/css/[name].[contenthash:8].css',
    }),

    // 删除无用文件
    new CleanWebpackPlugin({
      dry: false,
      dangerouslyAllowCleanPatternsOutsideProject: true,
      cleanOnceBeforeBuildPatterns: BUILD_MODULES.length ? BUILD_MODULES.map((moduleName) => `${moduleName}/**/*`) : ['index/**/*'],
    }),

    ...(BUILD_MODULES.length
      ? []
      : [
          // 复制一些东西，如果有需要的话
          // new CopyWebpackPlugin({
          //   patterns: [
          //     // TEST
          //     { from: path.resolve(PROJECT_PATH, 'src/public'), to: path.resolve(PROJECT_PATH, 'dist/public') },
          //   ],
          // }),
        ]),

    // 去除无用样式
    ...(BUILD_MODULES.includes('base')
      ? []
      : [
          new PurgeCSSPlugin({
            paths: glob.sync(`${path.resolve(PROJECT_PATH, './src')}/**/*.{tsx,scss,less,css}`, { nodir: true }),
          }),
        ]),

    // sentry 上报
    // new SentryPlugin({
    //   project: CONSTANTS.SENTRY_PROJECT_SLUG,
    //   apiKey: CONSTANTS.SENTRY_APIKEY,
    //   suppressErrors: true,
    //   release: CONSTANTS.RELEASE_TAG,
    //   deleteAfterCompile: true,
    //   filenameTransform: (filename) => `~/public/${filename}`,
    //   exclude: /\.css\.map$/,
    // }),

    // TerserPlugin去除了所以注释，若需要添加注释，使用 @preserve 字样
    // new webpack.BannerPlugin({
    //   raw: true,
    //   banner: '/** @preserve Powered by briefNull */',
    // }),

    // new UnusedFilesWebpackPlugin({
    //   failOnUnused: true,
    //   patterns: ['./src/**/*.*'],
    // }),
  ],

  // 设置信息展示
  stats: 'minimal',
}

// 支持 bundler 分析
if (process.env.IS_ANALYZER === 'true') {
  productionConfig.plugins.push(new BundleAnalyzerPlugin())
}

// module.exports = smp.wrap(merge(commonConfig, productionConfig))
module.exports = merge(commonConfig, productionConfig)
