// const os = require('os')
const path = require('path')

// module.exports = (() => {
//   const variables = {}

//   // 服务端根目录
//   variables.SERVER_ROOT = path.resolve(__dirname, '../../server')

//   // 静态文件路径
//   variables.PUBLIC_ROOT = path.resolve(variables.SERVER_ROOT, 'app/public')

//   // manifest 路径
//   variables.MANIFEST_ROOT = path.resolve(variables.SERVER_ROOT, 'app/manifest')

//   // Sentry 配置
//   variables.SENTRY_PROJECT_SLUG = 'name'
//   variables.SENTRY_APIKEY = 'xxx'

//   // 动态生成每次的 ReleaseTag
//   variables.RELEASE_TAG = `${os.userInfo().username}-${Date.now()}`

//   return variables
// })()

// 项目所在根目录
const PROJECT_PATH = path.resolve(__dirname, '../')
// 项目所在根目录的名称
const PROJECT_NAME = path.parse(PROJECT_PATH).name
// 项目依赖的模块，目前只有base
const COMMON_MODULES = ['base']
// 动态生成要编译的模块
const BUILD_MODULES = process.env.BUILD_MODULES.split('&').filter((moduleName) => COMMON_MODULES.includes(moduleName))

module.exports = {
  PROJECT_PATH,
  PROJECT_NAME,
  BUILD_MODULES,
  COMMON_MODULES,
}
