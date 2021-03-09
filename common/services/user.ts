import { post } from '@common/utils'
import { userApis } from '@common/services/apis'
import type { ServiceResult } from '@common/types'
import type { UserState } from '@common/store/types'

export function list(params: Record<string, string>): ServiceResult<UserState> {
  return post<UserState, typeof params>(userApis.LIST, params)
}
