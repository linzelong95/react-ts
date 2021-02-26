const webpack = require('webpack')
const { WEB_ROOT } = require('./constants')

module.exports = {
  mode: 'development',

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },

  context: WEB_ROOT,

  entry: {
    react: ['react', 'react-dom', 'react-router', 'react-router-dom', 'redux', 'react-redux'],
    tool: [
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

  output: {
    path: `${WEB_ROOT}/dist/dll`,
    filename: '[name]-dll.js',
    // library必须和后面dllplugin中的name一致 后面会说明
    library: 'dll_[name]_[fullhash]',
  },

  devtool: 'eval-cheap-module-source-map',

  plugins: [
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),

    new webpack.DllPlugin({
      context: WEB_ROOT,
      path: `${WEB_ROOT}/dist/dll/[name]-manifest.json`,
      name: 'dll_[name]_[fullhash]',
      format: true,
    }),
  ],

  performance: {
    hints: false,
  },
}
