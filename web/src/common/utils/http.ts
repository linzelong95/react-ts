import { v4 as uuid } from 'uuid'
import { parse } from 'qs'
import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'
import { tryCatch } from './util'
import { CommonError } from '@common/types'

export enum StatusCode {
  BAD_REQ = 400, // Bad Request 客户端请求的语法错误，服务器无法理解
  NOT_LOGGED = 401, // Unauthorized 请求要求用户的身份认证
  NOT_LOGGED_FOR_ADMIN = 4010, // 自定义：未登录（特指管理员）
  FORBIDDEN = 403, // Forbidden 服务器理解请求客户端的请求，但是拒绝执行此请求
  NOT_FOUND = 404, // Not Found 服务器无法根据客户端的请求找到资源（网页）
}

export const http = axios.create({
  baseURL: '/',
  timeout: 30000,
  withCredentials: true,
  // more
})

// 做一些默认值得配置
// http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

// 请求前做一些操作
http.interceptors.request.use((req: AxiosRequestConfig) => {
  // 统一带上请求 ID，便于追溯，假设有这样的需求
  req.headers['X-Seq-Id'] = `blog-${uuid()}`

  // 假设有这样的需求
  // 如果当前 URL 上有 access_token，统一带上
  const query = parse(window.location.search, { ignoreQueryPrefix: true })

  if (query.access_token) {
    if (!req.params) req.params = {}
    req.params.access_token = query.access_token
  }

  return req
})

// 响应时做一些操作
http.interceptors.response.use(
  (res: AxiosResponse<{ code: number; message?: string; data?: Record<string, any> }>) => {
    const {
      status,
      data: { code, message },
    } = res

    console.log(888, res)

    // code为0表示成功，不为0表示异常
    if (code !== 0) {
      if (code === StatusCode.NOT_LOGGED_FOR_ADMIN) {
        console.log('这里做报错的相关处理')
      }
      const error = new Error(typeof message === 'string' ? message.slice(0, 100) : message)
      ;((error as unknown) as CommonError).code = code
      ;((error as unknown) as CommonError).status = status
      ;((error as unknown) as CommonError).rawResponse = res
      return Promise.reject(error)
    }
    return res
  },
  (err: AxiosError<{ code: number; message?: string; data?: Record<string, any> }>) => {
    // 服务端代码错误，如访问ctx.a.b(ctx不存在a变量)时
    const {
      response: { status, statusText, data },
    } = err
    const { code = status, message = statusText || '请求错误，请联系相关人员' } = data

    if (code === 401) {
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
 * 经过 tryCatch 封装的方法
 * @param {AxiosRequestConfig} config axios 原始配置
 * @return {[T, AxiosError]} 返回一个元组，第一个为请求的结果，第二个为错误对象
 *
 * const [res, err] = await request({ method: 'GET', data: { a: 1 } })
 * if (err) { return console.error(err) }
 * console.log(res.code)  // 0
 *
 */
export function request<T = any>(config: AxiosRequestConfig): Promise<[T, null] | [null, AxiosError]> {
  return tryCatch<T, AxiosError>(http(config).then((res) => res.data))
}

export function get<T = any>(url: string, data: any = {}, config?: AxiosRequestConfig): Promise<[T, null] | [null, CommonError]> {
  return tryCatch<T, CommonError>(http.get(url, { ...config, params: data }).then((res) => res.data))
}

export function post<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<[T, null] | [null, CommonError]> {
  return tryCatch<T, CommonError>(http.post(url, data, config).then((res) => res.data))
}

export function put<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<[T, null] | [null, CommonError]> {
  return tryCatch<T, CommonError>(http.put(url, data, config).then((res) => res.data))
}

export function del<T = any>(url: string, config?: AxiosRequestConfig): Promise<[T, null] | [null, CommonError]> {
  return tryCatch<T, CommonError>(http.delete(url, config).then((res) => res.data))
}

export function patch<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<[T, null] | [null, CommonError]> {
  return tryCatch<T, CommonError>(http.patch(url, data, config).then((res) => res.data))
}
