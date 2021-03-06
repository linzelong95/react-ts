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
    // 允许ctx.redirect跳转的非本域名链接，当domainWhiteList为空数组则等同于使用ctx.unsafeRedirect，此时跳转任意链接都放行
    domainWhiteList: ['127.0.0.1', '120.78.139.146', 'baidu.com'],
    // Cross Site Request Forgery，跨站域请求伪造,验证referer字段/通过token值校验
    csrf: {
      enable: false,
    },
    // xframe:{
    //   enable:true,// 该配置旨在阻止非本域名页面以iframe嵌套本页面
    // }
    // Http Strict Transport Security，是响应头的信息，它告诉浏览器只能通过HTTPS访问当前资源，而不是HTTP
    // 开启hsts，在站点的响应头中设置Strict-Transport-Security,浏览器会将这个域名加入Hsts列表，下次用户早使用http访问这个网站，浏览器会自动发送https请求（但第一次访问还是http），而不是先发送http再重定向到https，避免302重定向url被篡改，进一步提高通信的安全性。
    // hsts: {
    //   enable: false,
    //   maxAge: 365 * 24 * 3600,
    //   includeSubdomains: false, //可以添加子域名，保证所有子域名都使用 HTTPS 访问。
    // },
    // CSP（Content Security Policy）指定资源可信任来源(脚本、图片、iframe、fton、style等等可能的远程的资源)，减少跨站脚本攻击
    // csp: {
    //   enable: true,
    //   policy: {
    //     'default-src': 'self',
    //   },
    // },
    // SSRF漏洞：（服务端请求伪造）是一种由攻击者构造形成由服务端发起请求的一个安全漏洞。一般情况下，SSRF攻击的目标是从外网无法访问的内部系统。（正是因为它是由服务端发起的，所以它能够请求到与它相连而与外网隔离的内部系统）。SSRF 形成的原因大都是由于服务端提供了从其他服务器应用获取数据的功能且没有对目标地址做过滤与限制。比如从指定URL地址获取网页文本内容，加载指定地址的图片，下载等等。利用的是服务端的请求伪造。ssrf是利用存在缺陷的web应用作为代理攻击远程和本地的服务器。
    // 框架在 ctx, app 和 agent 上都提供了 safeCurl 方法，在发起网络请求的同时会对指定的内网 IP 地址过滤，除此之外，该方法和框架提供的 curl 方法一致
    // ctx.safeCurl(url, options)
    // app.safeCurl(url, options)
    // agent.safeCurl(url, options)
    //     ssrf: {
    //       ipBlackList: [// 黑名单
    //         '10.0.0.0/8', // 支持 IP 网段
    //         '0.0.0.0/32',
    //         '127.0.0.1',  // 支持指定 IP 地址
    //       ],
    //       // 配置了 checkAddress 时，ipBlackList 不会生效
    //       checkAddress(ip) {
    //         return ip !== '127.0.0.1';
    //       },
    //     },
  }

  // 富文本等中的 href src允许全部域名
  config.helper = {
    shtml: {
      domainWhiteList: ['*'],
    },
  }

  // 当网站需要直接输出用户输入的结果时，请务必使用 ctx.helper.escape() 包裹起来
  // 网站输出的内容会提供给 JavaScript 来使用。这个时候需要使用 helper.sjs() 来进行过滤
  // 需要在 JavaScript 中输出 json ，这个时候需要使用  helper.sjson() 来进行转义
  // 框架提供了 helper.shtml() 方法对字符串进行 XSS 过滤。将富文本（包含 HTML 代码的文本）当成变量直接在模版里面输出时，需要用到 shtml 来处理

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
