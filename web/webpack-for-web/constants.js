// const os = require('os')
const path = require('path')

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
