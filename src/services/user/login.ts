import { post } from '@common/utils'
import { CommonError, CommonResponse } from '@common/types'
import apis from '@utils/apis'

export async function login<Res>(params: { email: string; password: string }): Promise<[CommonResponse<Res>, null] | [null, CommonError]> {
  return post<CommonResponse<Res>>(apis.user.LOGIN, params)
}
