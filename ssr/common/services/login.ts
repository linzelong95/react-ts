import { post, get } from '@ssr/common/utils'
import { loginApis } from '@ssr/common/services/apis'
import type { ServiceResult, IAccount } from '@ssr/common/types'
import type { UserState } from '@ssr/common/store/types'

export function login(params: IAccount['loginParams']): ServiceResult<UserState> {
  return post<UserState, typeof params>(`${loginApis.LOGIN}?t=${Date.now()}`, params)
}

export function logout(): ServiceResult {
  return post<never>(loginApis.LOGOUT)
}

export function register(params: IAccount['registerParams']): ServiceResult<UserState> {
  return post<UserState, typeof params>(loginApis.REGISTER, params)
}

export function getPublicKey(): ServiceResult<{ item: string }> {
  return get<{ item: string }>(loginApis.GET_PUBLIC_KEY)
}

export function getWebpageCaptcha(): ServiceResult<{ item: string }> {
  return get<{ item: string }>(`${loginApis.GET_WEBPAGE_CAPTCHA}?t=${Date.now()}`)
}

export function verifyCaptcha(captcha: string): ServiceResult {
  return post<never, { captcha: string }>(loginApis.VERIFY_WEBPAGE_CAPTCHA, { captcha })
}
