import { v4 as uuid } from 'uuid'
import { parse } from 'qs'
import axios from 'axios'
import { message as antMessage } from 'antd'
import { tryCatch, isClient } from './util'
import type { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'
import type { CommonResponse, CommonError, ServiceResult } from '@ssr/common/types'

export enum StatusCode {
  BAD_REQ = 400, // Bad Request 客户端请求的语法错误，服务器无法理解
  NOT_LOGGED = 401, // Unauthorized 请求要求用户的身份认证
  NOT_LOGGED_FOR_ADMIN = 4010, // 自定义：未登录（特指管理员）
  FORBIDDEN = 403, // Forbidden 服务器理解请求客户端的请求，但是拒绝执行此请求
  NOT_FOUND = 404, // Not Found 服务器无法根据客户端的请求找到资源（网页）
}

export const http = axios.create({
  baseURL: isClient ? '/' : 'http://127.0.0.1:7001/',
  timeout: 30000,
  withCredentials: true,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
})

// 请求前做一些操作
http.interceptors.request.use((req: AxiosRequestConfig) => {
  req.headers['X-Seq-Id'] = `blog-${uuid()}` // 唯一标记
  if (isClient) {
    const query = parse(window.location.search, { ignoreQueryPrefix: true })
    if (query.access_token) {
      if (!req.params) req.params = {}
      req.params.access_token = query.access_token
    }
  }
  return req
})

// 响应时做一些操作
http.interceptors.response.use(
  (res: AxiosResponse<{ code: number; message?: string; data?: Record<string, unknown> }>) => {
    const { status, data: { code, message } = {} } = res
    // code为0表示成功，不为0表示异常
    if (code !== 0) {
      if (isClient && code === StatusCode.NOT_LOGGED_FOR_ADMIN) {
        antMessage.error('您尚未登录')
        window.location.href = `/account/login?redirect=${window.location.href}`
        return
      }
      const error = new Error(typeof message === 'string' ? message.slice(0, 100) : message)
      ;((error as unknown) as CommonError).code = code
      ;((error as unknown) as CommonError).status = status
      ;((error as unknown) as CommonError).rawResponse = res
      return Promise.reject(error)
    }
    return res
  },
  (err: AxiosError<{ code: number; message?: string; data?: Record<string, unknown> }>) => {
    // 服务端代码错误，如访问ctx.a.b(ctx不存在a变量)时
    const { response: { status, statusText, data } = {} } = err
    const { code = status, message = statusText || '请求错误，请联系相关人员' } = data || {}
    if (isClient && code === StatusCode.NOT_LOGGED) {
      window.location.reload()
      return
    }
    const error = new Error(typeof message === 'string' ? message.slice(0, 30) : message)
    ;((error as unknown) as CommonError).code = code
    ;((error as unknown) as CommonError).status = status
    ;((error as unknown) as CommonError).rawError = err
    return Promise.reject(error)
  },
)

/**
 * @param {AxiosRequestConfig} config axios 原始配置
 * @return {[T, AxiosError]} 返回一个元组，[请求结果，错误对象]
 *
 * const [res, err] = await request({ method: 'GET', data: { param: 'example' } })
 *
 */
export function request<T = unknown>(config: AxiosRequestConfig): Promise<[CommonResponse<T>, null] | [null, AxiosError]> {
  return tryCatch<CommonResponse<T>, AxiosError>(http(config).then((res) => res.data))
}

export function get<T = unknown>(url: string, data: unknown = {}, config?: AxiosRequestConfig): ServiceResult<T> {
  return tryCatch<CommonResponse<T>, CommonError>(http.get(url, { ...config, params: data }).then((res) => res.data))
}

export function post<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): ServiceResult<T> {
  return tryCatch<CommonResponse<T>, CommonError>(http.post(url, data, config).then((res) => res.data))
}

export function put<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): ServiceResult<T> {
  return tryCatch<CommonResponse<T>, CommonError>(http.put(url, data, config).then((res) => res.data))
}

export function del<T = unknown>(url: string, config?: AxiosRequestConfig): ServiceResult<T> {
  return tryCatch<CommonResponse<T>, CommonError>(http.delete(url, config).then((res) => res.data))
}

export function patch<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): ServiceResult<T> {
  return tryCatch<CommonResponse<T>, CommonError>(http.patch(url, data, config).then((res) => res.data))
}

// {
//   // `url`是将用于请求的服务器URL
//   url: '/user',

//   // `method`是发出请求时使用的请求方法
//   method: 'get', // 默认

//   // `baseURL`将被添加到`url`前面，除非`url`是绝对的。
//   // 可以方便地为 axios 的实例设置`baseURL`，以便将相对 URL 传递给该实例的方法。
//   baseURL: 'https://some-domain.com/api/',

//   // `transformRequest`允许在请求数据发送到服务器之前对其进行更改
//   // 这只适用于请求方法'PUT'，'POST'和'PATCH'
//   // 数组中的最后一个函数必须返回一个字符串，一个 ArrayBuffer或一个 Stream

//   transformRequest: [function (data) {
//   // 做任何你想要的数据转换

//   return data;
//   }],

//   // `transformResponse`允许在 then / catch之前对响应数据进行更改
//   transformResponse: [function (data) {
//   // Do whatever you want to transform the data

//   return data;
//   }],

//   // `headers`是要发送的自定义 headers
//   headers: {'X-Requested-With': 'XMLHttpRequest'},

//   // `params`是要与请求一起发送的URL参数
//   // 必须是纯对象或URLSearchParams对象
//   params: {
//   ID: 12345
//   },

//   // `paramsSerializer`是一个可选的函数，负责序列化`params`
//   // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
//   paramsSerializer: function(params) {
//   return Qs.stringify(params, {arrayFormat: 'brackets'})
//   },

//   // `data`是要作为请求主体发送的数据
//   // 仅适用于请求方法“PUT”，“POST”和“PATCH”
//   // 当没有设置`transformRequest`时，必须是以下类型之一：
//   // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
//   // - Browser only: FormData, File, Blob
//   // - Node only: Stream
//   data: {
//   firstName: 'Fred'
//   },

//   // `timeout`指定请求超时之前的毫秒数。
//   // 如果请求的时间超过'timeout'，请求将被中止。
//   timeout: 1000,

//   // `withCredentials`指示是否跨站点访问控制请求
//   // should be made using credentials
//   withCredentials: false, // default

//   // `adapter'允许自定义处理请求，这使得测试更容易。
//   // 返回一个promise并提供一个有效的响应（参见[response docs]（＃response-api））
//   adapter: function (config) {
//   /* ... */
//   },

//   // `auth'表示应该使用 HTTP 基本认证，并提供凭据。
//   // 这将设置一个`Authorization'头，覆盖任何现有的`Authorization'自定义头，使用`headers`设置。
//   auth: {
//   username: 'janedoe',
//   password: 's00pers3cret'
//   },

//   // “responseType”表示服务器将响应的数据类型
//   // 包括 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
//   responseType: 'json', // default

//   //`xsrfCookieName`是要用作 xsrf 令牌的值的cookie的名称
//   xsrfCookieName: 'XSRF-TOKEN', // default

//   // `xsrfHeaderName`是携带xsrf令牌值的http头的名称
//   xsrfHeaderName: 'X-XSRF-TOKEN', // default

//   // `onUploadProgress`允许处理上传的进度事件
//   onUploadProgress: function (progressEvent) {
//   // 使用本地 progress 事件做任何你想要做的
//   },

//   // `onDownloadProgress`允许处理下载的进度事件
//   onDownloadProgress: function (progressEvent) {
//   // Do whatever you want with the native progress event
//   },

//   // `maxContentLength`定义允许的http响应内容的最大大小
//   maxContentLength: 2000,

//   // `validateStatus`定义是否解析或拒绝给定的promise
//   // HTTP响应状态码。如果`validateStatus`返回`true`（或被设置为`null` promise将被解析;否则，promise将被
//     // 拒绝。
//   validateStatus: function (status) {
//   return status >= 200 && status < 300; // default
//   },

//   // `maxRedirects`定义在node.js中要遵循的重定向的最大数量。
//   // 如果设置为0，则不会遵循重定向。
//   maxRedirects: 5, // 默认

//   // `httpAgent`和`httpsAgent`用于定义在node.js中分别执行http和https请求时使用的自定义代理。
//   // 允许配置类似`keepAlive`的选项，
//   // 默认情况下不启用。
//   httpAgent: new http.Agent({ keepAlive: true }),
//   httpsAgent: new https.Agent({ keepAlive: true }),

//   // 'proxy'定义代理服务器的主机名和端口
//   // `auth`表示HTTP Basic auth应该用于连接到代理，并提供credentials。
//   // 这将设置一个`Proxy-Authorization` header，覆盖任何使用`headers`设置的现有的`Proxy-Authorization` 自定义 headers。
//   proxy: {
//   host: '127.0.0.1',
//   port: 9000,
//   auth: : {
//   username: 'mikeymike',
//   password: 'rapunz3l'
//   }
//   },

//   // “cancelToken”指定可用于取消请求的取消令牌
//   // (see Cancellation section below for details)
//   cancelToken: new CancelToken(function (cancel) {
//   })
//   }
