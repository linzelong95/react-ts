/**
 * 统一返回类型封装
 */
import { AxiosError, AxiosResponse } from 'axios'

/**
 * 统一的响应类型
 * @param {unknown} T 数据类型
 */
export interface CommonResponse<T = unknown> {
  // 业务返回码
  code: number

  // 业务信息
  message: string

  // 数据
  data: T
}

/**
 * 统一的错误对象
 */
export interface CommonError {
  // 错误码
  code: number

  // 错误信息
  message: string

  // HTTP 状态码
  status: number

  // 原始响应
  // 如果返回的 HTTP 状态码 >= 400，则没有这个对象
  rawResponse?: AxiosResponse

  // 原始 axios 错误对象
  // 如果返回的 HTTP 状态码 < 400，则没有这个对象
  rawError?: AxiosError
}

export type ServiceResult<T = unknown> = Promise<[CommonResponse<T>, null] | [null, CommonError]>
