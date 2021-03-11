import { post } from '@common/utils'
import type { ServiceResult, IUser } from '@common/types'

enum UserApi {
  LIST = '/api/user/user/list',
}

export function getList(params: Record<string, string>): ServiceResult<IUser['getListRes']> {
  return post<IUser['getListRes'], typeof params>(UserApi.LIST, params)
}
