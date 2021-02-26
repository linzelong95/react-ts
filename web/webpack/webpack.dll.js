const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { WEB_ROOT } = require('./constants')

const generatedCompiler = (entry, dependOnReact) => {
  return webpack({
    mode: 'development',
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      alias: {
        'react-dom': '@hot-loader/react-dom',
      },
    },
    context: WEB_ROOT,
    entry,
    output: {
      path: `${WEB_ROOT}/dist/dll`,
      filename: '[name]_dll.js',
      library: 'dll_[name]_[fullhash]', // library必须和后面dllPlugin中的name一致
    },
    devtool: 'eval-cheap-module-source-map',
    plugins: [
      // 删除无用文件
      !dependOnReact &&
        new CleanWebpackPlugin({
          dry: false,
          dangerouslyAllowCleanPatternsOutsideProject: true,
          cleanOnceBeforeBuildPatterns: [`${WEB_ROOT}/dist/dll/**/*`],
        }),
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
      new webpack.DllPlugin({
        context: WEB_ROOT,
        path: `${WEB_ROOT}/dist/dll/[name]_manifest.json`,
        name: 'dll_[name]_[fullhash]',
        format: true,
      }),
      dependOnReact &&
        new webpack.DllReferencePlugin({
          context: WEB_ROOT,
          manifest: require(`${WEB_ROOT}/dist/dll/react_core_manifest.json`),
        }),
    ].filter(Boolean),
    performance: {
      hints: false,
    },
  })
}

new Promise((resolve, reject) => {
  generatedCompiler({ react_core: ['react', 'react-dom'] }, false).run((error, stats) => {
    if (error) reject(error)
    console.log('react_core success')
    resolve(stats)
  })
})
  .then(() => {
    generatedCompiler(
      {
        react_lib: ['react-router', 'react-router-dom', 'redux', 'react-redux'],
        tool_lib: [
          'moment',
          'xlsx',
          'axios',
          'i18next',
          'react-i18next',
          'i18next-browser-languagedetector',
          'antd/lib/locale/en_US',
          'antd/lib/locale/zh_CN',
          '@sentry/browser',
        ],
      },
      true,
    ).run((error) => {
      if (error) throw error
      console.log('react_lib、react_tool_lib success')
    })
  })
  .catch((error) => {
    console.log(error.message)
  })
