import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg'

export const rsaPrivateKey: string = `
-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQC/8YDeYSsOqS65mhjQIp0c0RgBi+Po+ECONRs6GIh4H2h5f4WG
5a8y/PcvhC9Bg06xHC+Zn9wj9OmYZ9cJl0cklhkngA018Azuv+aul53KJxEfD9eq
gevdP1+BtqDFYdMfjy0EVTZXzSxO+Wl7/2NtAmE/AuywA3t/EolsPMvFVQIDAQAB
AoGABlu+tB8t6Pdrx9Q1/DcZU0oN7Icwzpfis5NIypzjcG9B67xwtO5I5nyAx78u
PZJW+gEABqvIBBzp3BWchwHO5nWKJvo2CQ2D779kTEx8nsZiCr/pYQZg3cge4tR4
RQyyoDEE8DyyGO2emgiVqSuh/XyidT91LtW4R5HzZhofR8ECQQD+0OG92xrVs6Wm
x5eSVeeU6cvnVKevowbDDr+5EsP6eVC72SwG5XfYm77QVhuCvcLMDBv1qiBkyKAH
5b3dUx3RAkEAwNXUwBJa1OV1g7bE223xEw9BARyqaVmuZR/yDxzcYZxx1H3LJGpj
tABFu3Ku/FVZPy7T0iHc/E/nYvawbxv8RQJBAJLYvb8z7ZsKFISwsWDbsMHYmnGO
D7TgNp1ieoqljdti3mvjE8RFqXNjDevyM5h80y3ULKi+ijyKge8LLwfFRoECQDW6
XnC1rIEs/bUZM3hABa9dzKrWpdR8nE6ou/TiAbVgtYaTFgqraeQ5PzSfG4pK7Xbh
QTuHG99hFANK4JXUolECQQDC/BziFhbcH+WRk3XE3p9IhYvN6adLaHnK5VDGjejg
ZpGpnitzadqqKRVJEO8s+W/E7gZZv9MWC/h6wzlScX3/
-----END RSA PRIVATE KEY-----
`

export const rsaPublicKey: string = `
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/8YDeYSsOqS65mhjQIp0c0RgB
i+Po+ECONRs6GIh4H2h5f4WG5a8y/PcvhC9Bg06xHC+Zn9wj9OmYZ9cJl0cklhkn
gA018Azuv+aul53KJxEfD9eqgevdP1+BtqDFYdMfjy0EVTZXzSxO+Wl7/2NtAmE/
AuywA3t/EolsPMvFVQIDAQAB
-----END PUBLIC KEY-----
`

const isApi = /^\/api\//

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>

  // 保密
  config.keys = appInfo.name + '_test'

  // 保密
  config.rsaPrivateKey = rsaPrivateKey

  config.rsaPublicKey = rsaPublicKey

  config.cos = {
    bucket: 'brief',
    appId: '1302086393',
    region: 'ap-shenzhen-fsi',
    cosUrl: 'https://brief-1302086393.cos.ap-shenzhen-fsi.myqcloud.com',
    secretId: 'xxx', // 保密
    secretKey: 'xxx', // 保密
  }

  config.mysql = {
    host: '120.78.139.146',
    // host:'127.0.0.1',
    port: 3306,
    username: 'root',
    password: 'admin',
    database: 'myblog',
  }

  config.session = {
    key: 'EGG_SESS',
    maxAge: 24 * 3600 * 1000, // 1 天
    httpOnly: true,
    encrypt: true,
    signed: true,
    overwrite: true,
    renew: true,
  }

  /**
   * 模板渲染
   * @see https://eggjs.org/zh-cn/core/view.html
   * @see https://github.com/eggjs/egg-view#use-a-template-engine
   */
  config.view = {
    mapping: {
      '.ejs': 'ejs',
    },
  }

  /**
   * 一些 view 用到的变量
   * @see https://eggjs.org/zh-cn/core/view.html#locals
   */
  config.locals = {
    title: 'blog',
    keywords: '',
    description: '',
    favicon: '',
  }

  // 中间件
  config.middleware = ['request', 'response', 'passport']

  // 中间件passport的默认参数
  config.passport = {
    isApi,
    rsaPrivateKey,
    adminUrlRegexList: [/^\/api\/admin\/.+/],
    authUserUrlRegexList: [/^\/api\/user\/[^?]+\/(delete|save)/],
  }

  config.request = {
    ignoredUrls: [/^\/watermark/, /^\/public\/(.+)\.map$/],
  }

  // 中间件response的默认配置
  config.response = {
    isApi,
  }

  config.security = {
    domainWhiteList: [
      'http://localhost:8000',
      'http://localhost:8080',
      'http://localhost:80',
      'http://127.0.0.1:8000',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:80',
      'http://120.78.139.146:80',
      'http://120.78.139.146',
    ],
    csrf: {
      enable: false,
    },
  }

  config.cors = {
    origin: (ctx) => ctx.get('Origin'),
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  }

  config.multipart = {
    mode: 'stream',
    fileSize: '10mb',
    whitelist: ['.png', '.jpg', '.jpeg', '.gif'],
  }

  config.cluster = {
    listen: {
      port: 7001,
    },
  }

  /**
   * 放开 Body 限制
   * @see https://eggjs.org/en/basics/controller.html#body
   */
  config.bodyParser = {
    formLimit: '20mb',
    jsonLimit: '20mb',
  }

  // 监听变化并重启进程
  config.development = {
    overrideDefault: true,
    watchDirs: ['app', 'config'],
    ignoreDirs: ['app/public', 'app/manifest'],
  }

  /**
   *  国际化配置
   *@see https://eggjs.org/zh-cn/core/i18n.html
   */
  config.i18n = {
    // 默认语言，默认 "zh-CN"
    defaultLocale: 'zh-CN',
    // URL 参数，默认 "locale"
    queryField: 'locale',
    // Cookie 记录的 key, 默认："locale"
    cookieField: 'locale',
    // Cookie 默认 `1y` 一年后过期， 如果设置为 Number，则单位为 ms
    cookieMaxAge: '1y',
  }

  /**
   * 日志配置
   * @see https://eggjs.org/zh-cn/core/logger.html
   */
  config.logger = {
    appLogName: `${appInfo.name}-log.log`,
    coreLogName: `${appInfo.name}-core.log`,
    agentLogName: `${appInfo.name}-agent.log`,
    errorLogName: `${appInfo.name}-error.log`,
  }

  // 告警配置
  config.alarm = {
    defaultTitle: '【blog Alarm】',
    defaultSender: 'blog-alarm',
    defaultEmailSender: 'blog',
    receivers: ['briefNull'],
  }

  // sentry 配置
  config.sentry = {
    dsn: 'https://120.78.139.146/sentry/888',
  }

  return config
}
