import { post, get } from '@ssr/common/utils'
import type { ServiceResult, IAccount } from '@ssr/common/types'
import type { UserState } from '@ssr/common/store/types'

enum AccountApi {
  LOGIN = '/api/account/login',
  LOGOUT = '/api/account/logout',
  REGISTER = '/api/account/register',
  GET_PUBLIC_KEY = '/api/account/getPublicKey',
  GET_WEBPAGE_CAPTCHA = '/api/account/getCaptcha',
  VERIFY_WEBPAGE_CAPTCHA = '/api/account/verifyCaptcha',
}

export function login(params: IAccount['loginParams']): ServiceResult<UserState> {
  return post<UserState, typeof params>(`${AccountApi.LOGIN}?t=${Date.now()}`, params)
}

export function logout(): ServiceResult {
  return post<never>(AccountApi.LOGOUT)
}

export function register(params: IAccount['registerParams']): ServiceResult<UserState> {
  return post<UserState, typeof params>(AccountApi.REGISTER, params)
}

export function getPublicKey(): ServiceResult<{ item: string }> {
  return get<{ item: string }>(AccountApi.GET_PUBLIC_KEY)
}

export function getWebpageCaptcha(): ServiceResult<{ item: string }> {
  return get<{ item: string }>(`${AccountApi.GET_WEBPAGE_CAPTCHA}?t=${Date.now()}`)
}

export function verifyCaptcha(captcha: string): ServiceResult {
  return post<never, { captcha: string }>(AccountApi.VERIFY_WEBPAGE_CAPTCHA, { captcha })
}
