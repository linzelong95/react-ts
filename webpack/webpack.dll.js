const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { WEB_ROOT, PUBLIC_ROOT } = require('./constants')

const __BASIC_CORE__ = 'basic_core'

const generatedCompiler = (entry, dependOnReact, callback) => {
  return webpack(
    {
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
        path: `${PUBLIC_ROOT}/dll`,
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
            cleanOnceBeforeBuildPatterns: [`${PUBLIC_ROOT}/dll/**/*`],
          }),
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
        new webpack.DllPlugin({
          path: `${PUBLIC_ROOT}/dll/[name]_manifest.json`,
          name: 'dll_[name]_[fullhash]',
          format: true,
        }),
        dependOnReact &&
          new webpack.DllReferencePlugin({
            manifest: require(`${PUBLIC_ROOT}/dll/${__BASIC_CORE__}_manifest.json`),
          }),
      ].filter(Boolean),
      performance: {
        hints: false,
      },
    },
    callback,
  )
}

generatedCompiler({ [__BASIC_CORE__]: ['react', 'react-dom'] }, false, (error) => {
  if (error) throw error
  generatedCompiler(
    {
      react_lib: ['react-router', 'react-router-dom', 'redux', 'react-redux'],
      tool_lib: [
        'moment',
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
    console.log('npm run dll successfully ~~~')
  })
})
