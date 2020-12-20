const path = require('path')
const fs = require('fs')
const execa = require('execa')

const modules = process.argv.slice(3) // 目前是没有多模块的，该字段暂时无意义
const mode = process.argv[2]
const cwd = path.resolve(__dirname, '../')
const environment = {
  NODE_ENV: mode,
  BUILD_MODULES: modules.length === 0 ? '' : modules.join('&'),
  IS_ANALYZER: mode === 'analyzer',
  NODE_OPTIONS: '--max-old-space-size=8172',
}

// 执行 webpack
if (mode === 'dev') {
  environment.NODE_ENV = 'development'
  // webpack 5用这个
  execa('webpack', ['serve', '--config', 'webpack/webpack.development.js'], { cwd, env: environment, buffer: false, stdio: 'inherit' })
  // execa('webpack-dev-server', ['--config', 'webpack/webpack.development.js'], { cwd, env: environment, buffer: false, stdio: 'inherit' })
}

if (mode === 'build') {
  environment.NODE_ENV = 'production'
  execa('webpack', ['--config', 'webpack/webpack.production.js'], { cwd, env: environment, buffer: false, stdio: 'inherit' })
}

if (mode === 'build-all') {
  const files = fs.readdirSync(path.resolve(__dirname, '../src'), { withFileTypes: true })
  const folders = files
    .filter((file) => file.isDirectory())
    .map((file) => file.name)
    .filter((name) => name !== 'base' && name !== 'common')

  environment.NODE_ENV = 'production'
  environment.BUILD_MODULES = folders.join('&')
  execa('webpack', ['--config', 'webpack/webpack.production.js'], { cwd, env: environment, buffer: false, stdio: 'inherit' })
}

if (mode === 'analyzer') {
  environment.NODE_ENV = 'production'
  execa('webpack', ['--profile', '--config', 'webpack/webpack.production.js'], { cwd, env: environment, buffer: false, stdio: 'inherit' })
}
