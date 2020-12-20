const { merge } = require('webpack-merge')
const glob = require('glob')
const path = require('path')
// const PurgeCSSPlugin = require('purgecss-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const SentryPlugin = require('@tencent/webpack-sentry-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// 测速插件，webpack 5暂不支持
// const smp = new SpeedMeasurePlugin()

// configs
const commonConfig = require('./webpack.common')

// 常量
const CONSTANTS = require('./constants')
const { PROJECT_PATH } = CONSTANTS
// const cleanPaths = CONSTANTS.BUILD_MODULES.reduce((allCleanPaths, currentModule) => [...allCleanPaths, `js/${currentModule}/*`, `css/${currentModule}/*`], [])

const productionConfig = {
  mode: 'production',

  output: {
    filename: 'js/[name].[hash:8].js',
    path: path.resolve(__dirname, '../dist'),
  },

  devtool: 'source-map',

  optimization: {
    splitChunks: false,
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
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:8].css',
    }),

    // 删除无用文件
    new CleanWebpackPlugin({
      dry: false,
      dangerouslyAllowCleanPatternsOutsideProject: true,
      // cleanOnceBeforeBuildPatterns: cleanPaths,
    }),

    // 去除无用样式,webpack 5暂时不兼容
    // new PurgeCSSPlugin({
    //   paths: glob.sync(`${path.resolve(PROJECT_PATH, './src')}/**/*.{tsx,scss,less,css}`, { nodir: true }),
    //   whitelist: ['html', 'body'],
    // }),

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
