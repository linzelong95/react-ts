const os = require('os')
const { merge } = require('webpack-merge')
// const PurgeCSSPlugin = require('purgecss-webpack-plugin')
// webpack v5用CssMinimizerPlugin，而不使用OptimizeCSSAssetsPlugin
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
// const CompressionPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const SentryPlugin = require('webpack-sentry-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
// 找到没有用到的废弃文件
// const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

// 测速插件，webpack 5暂不支持
// const smp = new SpeedMeasurePlugin()

const commonConfig = require('./webpack.common')

const { BUILD_MODULES, PUBLIC_ROOT, MANIFEST_ROOT, RELEASE_TAG } = require('./constants')

const productionConfig = {
  mode: 'production',

  output: {
    filename: '[name]/js/[name]-[contenthash:8].js',
    path: PUBLIC_ROOT,
    publicPath: '/public/',
    chunkFilename: (pathData) => `${pathData.chunk.runtime}/js/chunks/[id].js`,
    assetModuleFilename: (pathData) => `${pathData.runtime}/js/asset/[name]-[hash][ext][query]`,
  },

  devtool: 'source-map',

  optimization: {
    splitChunks: false,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
          compress: { pure_funcs: ['console.log'] },
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },

  plugins: [
    // 抽离出css
    new MiniCssExtractPlugin({
      filename: '[name]/css/[name]-[contenthash:8].css',
      chunkFilename: (pathData) => `${pathData.chunk.runtime}/css/chunks/[id].css`,
    }),

    // 删除无用文件
    new CleanWebpackPlugin({
      dry: false,
      dangerouslyAllowCleanPatternsOutsideProject: true,
      cleanOnceBeforeBuildPatterns: BUILD_MODULES.length ? BUILD_MODULES.map((moduleName) => `${moduleName}/**/*`) : ['index/**/*'],
    }),

    // 使用zip压缩（配置此项，nginx等方向代理无需开启zip压缩）
    // new CompressionPlugin(),

    // 生成清单
    ...BUILD_MODULES.map((moduleName) => {
      return new WebpackManifestPlugin({
        fileName: `${MANIFEST_ROOT}/${moduleName}.manifest.json`,
        writeToFileEmit: true,
        seed: {},
        generate: (seed, files) => {
          for (const file of files) {
            const { name, path } = file
            if (name === `${moduleName}.js` || name === `${moduleName}.css`) {
              seed[name] = {
                path,
                editor: os.userInfo().username,
                release: RELEASE_TAG,
              }
            }
          }
          return seed
        },
        filter: (file) => /\.(js|css)$/.test(file.name),
      })
    }),

    // 去除无用样式，使用其他有点问题，似乎无法跟webpack动态加载同时使用？
    // !BUILD_MODULES.includes('base') &&
    //   new PurgeCSSPlugin({
    //     paths: glob.sync(`${path.resolve(WEB_ROOT, './src')}/**/*`, { nodir: true }),
    //   }),

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

    // bundler 分析
    process.env.IS_ANALYZER === 'true' && new BundleAnalyzerPlugin(),
  ].filter(Boolean),

  // 设置信息展示
  stats: 'minimal',
}

// module.exports = smp.wrap(merge(commonConfig, productionConfig))
module.exports = merge(commonConfig, productionConfig)
