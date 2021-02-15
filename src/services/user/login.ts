import { post } from '@common/utils'
import { userApis } from '@services/apis'
import type { CommonError, CommonResponse } from '@common/types'
import type { UserState } from '@store/types'

export interface LoginParams {
  account?: string
  password?: string
  captcha?: string
  autoLogin: boolean
}

export function login(params: LoginParams): Promise<[CommonResponse<UserState>, null] | [null, CommonError]> {
  return post<CommonResponse<UserState>, LoginParams>(`${userApis.LOGIN}?t=${Date.now()}`, params)
}

export function logout(): Promise<[CommonResponse, null] | [null, CommonError]> {
  return post<CommonResponse>(userApis.LOGOUT)
}

export function register(params: LoginParams): Promise<[CommonResponse<UserState>, null] | [null, CommonError]> {
  return post<CommonResponse<UserState>, LoginParams>(userApis.REGISTER, params)
}

export function getPublicKey(): Promise<[CommonResponse<{ item: string }>, null] | [null, CommonError]> {
  return post<CommonResponse<{ item: string }>>(userApis.GET_PUBLIC_KEY)
}

export function getWebpageCaptcha(): Promise<[CommonResponse<{ item: string }>, null] | [null, CommonError]> {
  return post<CommonResponse<{ item: string }>>(`${userApis.GET_WEBPAGE_CAPTCHA}?t=${Date.now()}`)
}

export function verifyCaptcha(captcha: string): Promise<[CommonResponse<any>, null] | [null, CommonError]> {
  return post<CommonResponse<any>, { captcha: string }>(userApis.VERIFY_WEBPAGE_CAPTCHA, { captcha })
}
