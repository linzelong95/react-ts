import { EggPlugin } from 'egg'

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
}

export default plugin
