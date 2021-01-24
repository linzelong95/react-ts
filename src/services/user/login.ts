import { post } from '@common/utils'
import { userApis } from '@services/apis'
import type { CommonError, CommonResponse } from '@common/types'
import type { UserState } from '@store/types'

export interface LoginParams {
  account: string
  password: string
  autoLogin: boolean
}

export function login(params: LoginParams): Promise<[CommonResponse<UserState>, null] | [null, CommonError]> {
  return post<CommonResponse<UserState>>(userApis.LOGIN, { ...params, t: Date.now() })
}

export function logout<Res = unknown>(): Promise<[CommonResponse<Res>, null] | [null, CommonError]> {
  return post<CommonResponse<Res>>(userApis.LOGOUT)
}

export function getPublicKey(): Promise<[CommonResponse<{ item: string }>, null] | [null, CommonError]> {
  return post<CommonResponse<{ item: string }>>(userApis.GET_PUBLIC_KEY)
}
