const os = require('os')
const glob = require('glob')
const { merge } = require('webpack-merge')
// webpack v5用CssMinimizerPlugin，而不使用OptimizeCSSAssetsPlugin
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const SentryPlugin = require('webpack-sentry-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
// 找到没有用到的废弃文件
// const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

// 测速插件，webpack 5暂不支持
// const smp = new SpeedMeasurePlugin()

const templateParameters = require('./template-parameters')

const commonConfig = require('./webpack.common')

const {
  BUILD_MODULES,
  WEB_ROOT,
  SERVER_ROOT,
  PUBLIC_ROOT,
  MANIFEST_ROOT,
  RELEASE_TAG,
} = require('./constants')

const productionConfig = {
  mode: 'production',

  output: {
    path: PUBLIC_ROOT,
    publicPath: '/public/',
    // filename: '[name]/js/[name]_[contenthash].js',
    // chunkFilename: (pathData) => `${pathData.chunk.runtime}/js/chunks/[id]_[contenthash].js`,
    // assetModuleFilename: (pathData) => `${pathData.runtime}/js/asset/[name]_[hash][ext][query]`,
    filename: (pathData) =>
      pathData.chunk.name.includes('runtime')
        ? '[name]_[contenthash].js'
        : '[name]/[name]_[contenthash].js',
    chunkFilename: (pathData) => `${pathData.chunk.runtime}/[name]_[id]_[contenthash].js`,
    assetModuleFilename: (pathData) => `${pathData.runtime}/asset/[name]_[hash][ext][query]`,
  },

  // devtool: 'source-map',

  optimization: {
    splitChunks: false,
    // splitChunks: {
    //   cacheGroups: {
    //     defaultVendors: false,
    //     default: false,
    //     react_core: {
    //       name: 'common/react_core',
    //       filename: (pathData) => `${pathData.chunk.name}_[contenthash].js`,
    //       chunks: 'all',
    //       test: /[/\\]node_modules[/\\](react|react-dom|react-router)[/\\]/,
    //       enforce: true,
    //       reuseExistingChunk: true,
    //       priority: 10,
    //     },
    //   },
    // },
    runtimeChunk: !BUILD_MODULES.includes('base') && {
      name: (entry) => `${entry.name}/runtime~${entry.name}`,
    },
    emitOnErrors: true,
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
    // TS 类型检查
    process.env.IS_ANALYZER !== 'true' &&
      new ForkTsCheckerWebpackPlugin({
        eslint: {
          enabled: true,
          // 路径相对于项目根目录
          // files: ['**/spa/**/*.{ts,tsx}'],
          files: BUILD_MODULES.map((moduleName) => `spa/${moduleName}/**/*.{ts,tsx}`),
        },
      }),

    new CopyWebpackPlugin({
      patterns: BUILD_MODULES.map((moduleName) => ({
        from: `${WEB_ROOT}/spa/${moduleName}/favicon.ico`,
        to: `${PUBLIC_ROOT}/${moduleName}`,
      })),
    }),

    // 抽离出css
    new MiniCssExtractPlugin({
      // filename: '[name]/css/[name]_[contenthash].css',
      // chunkFilename: (pathData) => `${pathData.chunk.runtime}/css/chunks/[id]_[contenthash].css`,
      filename: (pathData) =>
        pathData.chunk.name.includes('runtime')
          ? '[name]_[contenthash].css'
          : '[name]/[name]_[contenthash].css',
      chunkFilename: (pathData) => `${pathData.chunk.runtime}/[name]_[id]_[contenthash].css`,
    }),

    // 删除无用文件,路径相对于output
    new CleanWebpackPlugin({
      dry: false,
      cleanOnceBeforeBuildPatterns: BUILD_MODULES.reduce((patterns, moduleName) => {
        patterns.push(`${moduleName}/**/*`)
        // patterns.push(`!${moduleName}/**/favicon.ico`) // 加上 ！表示不要清除该项
        return patterns
      }, []),
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
          const regExp = new RegExp(`^(${moduleName}/runtime~)?${moduleName}\\.(js|css)`)
          for (const file of files) {
            const { name, path } = file
            if (regExp.test(name)) {
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
    ...(process.env.IS_ANALYZER === 'true'
      ? [
          new BundleAnalyzerPlugin(),
          ...BUILD_MODULES.map((moduleName) => {
            if (moduleName === 'base') return null
            return new HtmlWebpackPlugin({
              template: `${SERVER_ROOT}/app/view/index.ejs`,
              filename: `${moduleName}/index.html`,
              inject: 'body',
              chunks: [moduleName], // 若不设置则默认将当前entry多文件全部注入
              templateParameters: {
                ...templateParameters,
                ...templateParameters[moduleName],
                cssList: [
                  ...glob.sync(`${PUBLIC_ROOT}/base/**/*.css`, { nodir: true }).map(
                    (path) => `/${path.split('/').slice(-2).join('/')}`, // '/base/css/xxx.css'
                  ),
                  ...((templateParameters[moduleName] && templateParameters[moduleName].cssList) ||
                    []),
                ],
                jsList: [
                  ...glob.sync(`${PUBLIC_ROOT}/dll/*.js`, { nodir: true }).map(
                    (path) => `/${path.split('/').slice(-2).join('/')}`, // '/dll/xxx.js', TODO:确保react、react-dom在最前面
                  ),
                  ...((templateParameters[moduleName] && templateParameters[moduleName].jsList) ||
                    []),
                ],
              },
              minify: {
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
        ]
      : []),
  ].filter(Boolean),

  // 设置信息展示
  stats: 'minimal',
}

// module.exports = smp.wrap(merge(commonConfig, productionConfig))
module.exports = merge(commonConfig, productionConfig)
