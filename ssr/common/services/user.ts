import { post } from '@ssr/common/utils'
import type { ServiceResult } from '@ssr/common/types'
import type { UserState } from '@ssr/common/store/types'

enum UserApi {
  LIST = '/api/user/user/list',
}

export function list(params: Record<string, string>): ServiceResult<UserState> {
  return post<UserState, typeof params>(UserApi.LIST, params)
}
