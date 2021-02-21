const path = require('path')
const fs = require('fs')
const execa = require('execa')

const modules = process.argv.slice(3)
const mode = process.argv[2]
const env = {
  NODE_ENV: mode,
  IF_HANDLE_ALL_LIBS: 'light', // 'all'|'light',默认不处理base基础依赖
  BUILD_MODULES: modules.join('&'),
  IS_ANALYZER: mode === 'analyzer',
  NODE_OPTIONS: '--max-old-space-size=8172',
}

const commonParams = { cwd: path.resolve(__dirname, '../'), buffer: false, stdio: 'inherit' }

if (['dev', 'dev-all-libs'].includes(mode)) {
  env.NODE_ENV = 'development'
  if (mode === 'dev-all-libs') env.IF_HANDLE_ALL_LIBS = 'all'
  execa('webpack', ['serve', '--config', 'webpack/webpack.development.js'], { ...commonParams, env })
  // execa('webpack-dev-server', ['--config', 'webpack/webpack.development.js'], { ...commonParams, env }) // webpack 4
}

if (['build', 'build-all', 'analyzer'].includes(mode)) {
  env.NODE_ENV = 'production'
  if (mode === 'build-all') {
    env.BUILD_MODULES = fs
      .readdirSync(path.resolve(__dirname, '../src'), { withFileTypes: true })
      .filter((file) => file.isDirectory() && !['base', 'common'].includes(file.name))
      .map((file) => file.name)
      .join('&')
  }
  execa('webpack', [mode === 'analyzer' && '--profile', '--config', 'webpack/webpack.production.js'].filter(Boolean), {
    ...commonParams,
    env,
  })
}
