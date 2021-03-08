import { post, get } from '@common/utils'
import { loginApis } from '@common/services/apis'
import type { ServiceResult, AccountTypeCollection } from '@common/types'
import type { UserState } from '@common/store/types'

export function login(params: AccountTypeCollection['loginParams']): ServiceResult<UserState> {
  return post<UserState, typeof params>(`${loginApis.LOGIN}?t=${Date.now()}`, params)
}

export function logout(): ServiceResult {
  return post<never>(loginApis.LOGOUT)
}

export function register(params: AccountTypeCollection['registerParams']): ServiceResult<UserState> {
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
