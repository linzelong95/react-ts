const os = require('os')
const path = require('path')

// 服务端根目录
const SERVER_ROOT = path.resolve(__dirname, '../../server')
// 服务端静态文件路径
const PUBLIC_ROOT = path.resolve(SERVER_ROOT, 'app/public')
// manifest 路径
const MANIFEST_ROOT = path.resolve(SERVER_ROOT, 'app/manifest')
// 动态生成每次的 ReleaseTag
const RELEASE_TAG = `${os.userInfo().username}-${Date.now()}`

// 项目所在根目录
const PROJECT_PATH = path.resolve(__dirname, '../')
// 项目所在根目录的名称
const PROJECT_NAME = path.parse(PROJECT_PATH).name
// 项目依赖的公共模块
const COMMON_MODULES = ['common']
// 动态生成要编译的模块
const BUILD_MODULES = process.env.BUILD_MODULES.split('&').filter((moduleName) => !COMMON_MODULES.includes(moduleName))

module.exports = {
  PROJECT_PATH,
  PROJECT_NAME,
  BUILD_MODULES,
  COMMON_MODULES,
  RELEASE_TAG,
  MANIFEST_ROOT,
  PUBLIC_ROOT,
  SERVER_ROOT,
}
