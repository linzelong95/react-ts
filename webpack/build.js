const path = require('path')
const fs = require('fs')
const execa = require('execa')

const modules = process.argv.slice(3)
const mode = process.argv[2]

const { ALL_MODULES, WEB_ROOT } = require('./constants')

if (!['dev', 'dll', 'build', 'build-all', 'analyzer'].includes(mode)) {
  throw new Error('您输入的指令有误')
}

if (!['dll', 'build-all'].includes(mode)) {
  if (!modules.length) {
    throw new Error(`必须添加要编译的 app 名，例如 npm run ${mode} appName`)
  }
  if (modules.some((module) => !ALL_MODULES.includes(module))) {
    throw new Error('请检查模块是否存在')
  }
}

if (modules.length > 1 && modules.includes('base')) {
  throw new Error('base模块请单独打包')
}

const env = {
  NODE_ENV: mode,
  BUILD_MODULES: modules.join('&'),
  IS_ANALYZER: mode === 'analyzer',
  NODE_OPTIONS: '--max-old-space-size=8172',
}

const commonParams = { cwd: WEB_ROOT, buffer: false, stdio: 'inherit' }

if (['dev'].includes(mode)) {
  env.NODE_ENV = 'development'
  execa('webpack', ['serve', '--config', 'webpack/webpack.development.js'], {
    ...commonParams,
    env,
  })
  // execa('webpack-dev-server', ['--config', 'webpack/webpack.development.js'], { ...commonParams, env }) // webpack 4
}

if (['build', 'build-all', 'analyzer'].includes(mode)) {
  env.NODE_ENV = 'production'
  if (mode === 'build-all') {
    env.BUILD_MODULES = fs
      .readdirSync(path.resolve(__dirname, '../spa'), { withFileTypes: true })
      .filter((file) => file.isDirectory() && !['base', 'common'].includes(file.name))
      .map((file) => file.name)
      .join('&')
  }
  execa(
    'webpack',
    [mode === 'analyzer' && '--profile', '--config', 'webpack/webpack.production.js'].filter(
      Boolean,
    ),
    {
      ...commonParams,
      env,
    },
  )
}

if (['dll'].includes(mode)) {
  env.NODE_ENV = 'development'
  execa('webpack', ['--config', 'webpack/webpack.dll.js', '--progress', '--profile'], {
    ...commonParams,
    env,
  })
}
