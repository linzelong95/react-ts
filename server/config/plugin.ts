import { EggPlugin } from 'egg'
import 'tsconfig-paths/register' // 解决egg.js中ts映射路径不生效问题

const plugin: EggPlugin = {
  /**
   * 静态文件
   * @see https://eggjs.org/zh-cn/plugins/static.html
   */
  static: true,

  /**
   * EJS 插件配置
   * @see https://github.com/eggjs/egg-view
   */
  ejs: {
    enable: true,
    package: 'egg-view-ejs',
  },

  /**
   * 跨域请求
   * @see https://github.com/eggjs/egg-cors
   */
  cors: {
    enable: true,
    package: 'egg-cors',
  },

  /**
   * 路由增强
   * @see https://github.com/eggjs/egg-router-plus
   */
  routerPlus: {
    enable: true,
    package: 'egg-router-plus',
  },

  /**
   * 多语言
   * @see https://github.com/eggjs/egg-i18n
   */
  i18n: {
    enable: true,
    package: 'egg-i18n',
  },
}

export default plugin
