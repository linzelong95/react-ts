const os = require('os')
const fs = require('fs')
const glob = require('glob')
const path = require('path')

const PROJECT_PATH = path.resolve(__dirname, '../')

// 服务端根目录
const SERVER_ROOT = path.resolve(PROJECT_PATH, 'server')
// 服务端静态文件路径
const PUBLIC_ROOT = path.resolve(SERVER_ROOT, 'app/public')
// manifest 路径
const MANIFEST_ROOT = path.resolve(SERVER_ROOT, 'app/manifest')
// 动态生成每次的 ReleaseTag
const RELEASE_TAG = `${os.userInfo().username}-${Date.now()}`
// WEB所在根目录
const WEB_ROOT = PROJECT_PATH
// 项目所在根目录的名称
const PROJECT_NAME = path.parse(PROJECT_PATH).name
// 动态生成要编译的模块,进入webpack构建时，才有process.env.BUILD_MODULES注入
const envBuildModules = process && process.env && process.env.BUILD_MODULES
const BUILD_MODULES = (envBuildModules && envBuildModules.split('&')) || []

const ALL_MODULES = glob
  .sync(`${WEB_ROOT}/spa/*`)
  .map((path) => {
    if (fs.lstatSync(path).isFile()) return null
    const [dirName] = path.split('/').slice(-1)
    return dirName
  })
  .filter(Boolean)

module.exports = {
  PROJECT_PATH,
  WEB_ROOT,
  PROJECT_NAME,
  BUILD_MODULES,
  ALL_MODULES,
  RELEASE_TAG,
  MANIFEST_ROOT,
  PUBLIC_ROOT,
  SERVER_ROOT,
}
