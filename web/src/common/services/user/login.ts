import { post, get } from '@common/utils'
import { userApis } from '@common/services/apis'
import type { ServiceResult } from '@common/types'
import type { UserState } from '@common/store/types'

export interface LoginParams {
  account?: string
  password?: string
  captcha?: string
  autoLogin: boolean
}

export function login(params: LoginParams): ServiceResult<UserState> {
  return post<UserState, typeof params>(`${userApis.LOGIN}?t=${Date.now()}`, params)
}

export function logout(): ServiceResult {
  return post<never>(userApis.LOGOUT)
}

export function register(params: LoginParams): ServiceResult<UserState> {
  return post<UserState, LoginParams>(userApis.REGISTER, params)
}

export function getPublicKey(): ServiceResult<{ item: string }> {
  return get<{ item: string }>(userApis.GET_PUBLIC_KEY)
}

export function getWebpageCaptcha(): ServiceResult<{ item: string }> {
  return get<{ item: string }>(`${userApis.GET_WEBPAGE_CAPTCHA}?t=${Date.now()}`)
}

export function verifyCaptcha(captcha: string): ServiceResult {
  return post<never, { captcha: string }>(userApis.VERIFY_WEBPAGE_CAPTCHA, { captcha })
}
