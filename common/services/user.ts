import { get } from '@common/utils'
import type { ServiceResult, IUser } from '@common/types'

enum UserApi {
  LIST = '/api/user/account/list',
}

export function getList(params: IUser['getListParams'] = {}): ServiceResult<IUser['getListRes']> {
  return get<IUser['getListRes']>(UserApi.LIST, params)
}
