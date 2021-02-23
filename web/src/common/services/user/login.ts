import { post, get } from '@common/utils'
import { userApis } from '@common/services/apis'
import type { ServiceResult, CommonResponse } from '@common/types'
import type { UserState } from '@common/store/types'

export interface LoginParams {
  account?: string
  password?: string
  captcha?: string
  autoLogin: boolean
}

export function login(params: LoginParams): ServiceResult<UserState> {
  return post<CommonResponse<UserState>, typeof params>(`${userApis.LOGIN}?t=${Date.now()}`, params)
}

export function logout(): ServiceResult {
  return post<CommonResponse>(userApis.LOGOUT)
}

export function register(params: LoginParams): ServiceResult<UserState> {
  return post<CommonResponse<UserState>, LoginParams>(userApis.REGISTER, params)
}

export function getPublicKey(): ServiceResult<{ item: string }> {
  return get<CommonResponse<{ item: string }>>(userApis.GET_PUBLIC_KEY)
}

export function getWebpageCaptcha(): ServiceResult<{ item: string }> {
  return get<CommonResponse<{ item: string }>>(`${userApis.GET_WEBPAGE_CAPTCHA}?t=${Date.now()}`)
}

export function verifyCaptcha(captcha: string): ServiceResult {
  return post<CommonResponse, { captcha: string }>(userApis.VERIFY_WEBPAGE_CAPTCHA, { captcha })
}
