import { EggAppConfig, PowerPartial } from 'egg'

export default (): PowerPartial<EggAppConfig> => {
  const config: PowerPartial<EggAppConfig> = {}
  config.security = {
    // ctx.redirect白名单
    domainWhiteList: ['127.0.0.1', '120.78.139.146'],
    csrf: {
      enable: true,
    },
    // 不允许本域页面嵌套于其他页面
    xframe: {
      enable: true,
      value: 'SAMEORIGIN',
    },
    // XST(Cross-Site Tracing),禁用trace方法
    methodnoallow: {
      enable: true,
    },
    // js、img、iframe、font、style远程的资源信任
    // 先关闭，需要处理图片资源信任（对指定cos链接信任）
    // script-src：外部脚本
    // style-src：样式表
    // img-src：图像
    // media-src：媒体文件（音频和视频）
    // font-src：字体文件
    // object-src：插件（比如 Flash）
    // child-src：框架
    // frame-ancestors：嵌入的外部资源（比如<frame>、<iframe>、<embed>和<applet>）
    // connect-src：HTTP 连接（通过 XHR、WebSockets、EventSource等）
    // worker-src：worker脚本
    // manifest-src：manifest 文件
    // base-uri：限制<base#href>
    // form-action：限制<form#action>
    // block-all-mixed-content：HTTPS 网页不得加载 HTTP 资源（浏览器已经默认开启）
    // upgrade-insecure-requests：自动将网页上所有加载外部资源的 HTTP 链接换成 HTTPS 协议
    // plugin-types：限制可以使用的插件格式
    // sandbox：浏览器行为的限制，比如不能有弹出窗口等。
    // report-uri /my_report_api
    // {
    //   "csp-report": {
    //     "document-uri": "http://example.org/page.html",
    //     "referrer": "http://evil.example.com/",
    //     "blocked-uri": "http://evil.example.com/evil.js",
    //     "violated-directive": "script-src 'self' https://apis.google.com",
    //     "original-policy": "script-src 'self' https://apis.google.com; report-uri http://example.org/my_amazing_csp_report_parser"
    //   }
    // }
    csp: {
      enable: true,
      policy: {
        'default-src': 'self',
        'img-src': '*',
        'media-src': '*',
        // 'script-src': 'self', // 只信任当前域名
        // 'style-src': 'self', // 'style-src':'cdn.example.org third-party.org',// 样式表：只信任http://cdn.example.org和http://third-party.org
        // 'object-src': 'none', // <object>标签：不信任任何URL，即不加载任何资源
      },
    },
  }
  return config
}

/**
 * security options
 * @member Config#security
 * @property {String} defaultMiddleware - default open security middleware
 * @property {Object} csrf - whether defend csrf attack
 * @property {Object} xframe - whether enable X-Frame-Options response header, default SAMEORIGIN
 * @property {Object} hsts - whether enable Strict-Transport-Security response header, default is one year
 * @property {Object} methodnoallow - whether enable Http Method filter
 * @property {Object} noopen - whether enable IE automaticlly download open
 * @property {Object} nosniff -  whether enable IE8 automaticlly dedect mime
 * @property {Object} xssProtection -  whether enable IE8 XSS Filter, default is open
 * @property {Object} csp - content security policy config
 * @property {Object} referrerPolicy - referrer policy config
 * @property {Object} dta - auto avoid directory traversal attack
 * @property {Array} domainWhiteList - domain white list
 * @property {Array} protocolWhiteList - protocal white list
 */
//  exports.security = {
//   domainWhiteList: [],
//   protocolWhiteList: [],
//   defaultMiddleware: 'csrf,hsts,methodnoallow,noopen,nosniff,csp,xssProtection,xframe,dta',

//   csrf: {
//     enable: true,

//     // can be ctoken or referer or all
//     type: 'ctoken',
//     ignoreJSON: false,

//     // These config works when using ctoken type
//     useSession: false,
//     // can be function(ctx) or String
//     cookieDomain: undefined,
//     cookieName: 'csrfToken',
//     sessionName: 'csrfToken',
//     headerName: 'x-csrf-token',
//     bodyName: '_csrf',
//     queryName: '_csrf',

//     // These config works when using referer type
//     refererWhiteList: [
//       // 'eggjs.org'
//     ],
//   },

//   xframe: {
//     enable: true,
//     // 'SAMEORIGIN', 'DENY' or 'ALLOW-FROM http://example.jp'
//     value: 'SAMEORIGIN',
//   },

//   hsts: {
//     enable: false,
//     maxAge: 365 * 24 * 3600,
//     includeSubdomains: false,
//   },

//   dta: {
//     enable: true,
//   },

//   methodnoallow: {
//     enable: true,
//   },

//   noopen: {
//     enable: true,
//   },

//   nosniff: {
//     enable: true,
//   },

//   referrerPolicy: {
//     enable: false,
//     value: 'no-referrer-when-downgrade',
//   },

//   xssProtection: {
//     enable: true,
//     value: '1; mode=block',
//   },

//   csp: {
//     enable: false,
//     policy: {},
//   },

//   ssrf: {
//     ipBlackList: null,
//     checkAddress: null,
//   },
// };
