import { v4 as uuid } from 'uuid'
import { parse } from 'qs'
import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'
import { tryCatch } from './util'
import { CommonError } from '@common/types'

/**
 * 原始请求方法
 * @usage
 *
 * ```
 * http({ method: 'GET', data: { a: 1 } })
 * http.get('/', { data: { a: 1 } })
 * http.post('/', { a: 1 })
 * http.del('/', { data: { a: 1 } })
 * http.put('/', { a: 1 })
 * http.patch('/', { a: 1 })
 * ```
 */
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
  (res: AxiosResponse) => {
    const {
      data: { code, message, status },
    } = res

    console.log(888, res)

    // 统一处理接口无权限操作的情况
    if (code === 401) {
      console.log('这里做报错的相关处理')
    }

    // 假设code=200表示成功，code！==200为失败
    // TODO:后面格式化为code为0表示成功，code不等于0表示失败
    if (code !== 200) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({
        code,
        message: typeof message === 'string' ? message.slice(0, 100) : message,
        status,
        rawResponse: res,
        rawError: null,
      } as CommonError)
    }

    return res
  },
  (err: AxiosError) => {
    const {
      response: { status, statusText, data },
    } = err
    const { code = status, message = statusText || '请求错误，请联系系统管理员' } = data

    if (status === 401) {
      return window.location.reload()
    }

    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({
      code,
      message: typeof message === 'string' ? message.slice(0, 30) : message,
      status,
      rawResponse: null,
      rawError: err,
    } as CommonError)
  },
)

/**
 * 经过 tryCatch 封装的方法
 * @param {AxiosRequestConfig} config axios 原始配置
 * @return {[T, AxiosError]} 返回一个元组，第一个为请求的结果，第二个为错误对象
 * ```
 * const [res, err] = await request({ method: 'GET', data: { a: 1 } })
 * if (err) { return console.error(err) }
 * // 安全的访问 res
 * console.log(res.code)  // 0
 * ```
 */
export function request<T = any>(config: AxiosRequestConfig): Promise<[T, null] | [null, AxiosError]> {
  return tryCatch<T, AxiosError>(http(config).then((res) => res.data))
}

/**
 * 经过 tryCatch 封装的方法，跟上方request不同的事，下边省去请求方法
 * @return {[T, CommonError]} 返回一个元组，第一个为请求的结果，第二个为错误对象
 * 使用方法：
 * ```
 * const [res, err] = await get('/', { params: { a: 1 } })
 * if (err) { return console.error(err) }
 * // 安全的访问 res
 * console.log(res.code)  // 0
 * ```
 */
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
