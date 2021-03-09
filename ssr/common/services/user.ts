import { post } from '@ssr/common/utils'
import { userApis } from '@ssr/common/services/apis'
import type { ServiceResult } from '@ssr/common/types'
import type { UserState } from '@ssr/common/store/types'

export function list(params: Record<string, string>): ServiceResult<UserState> {
  return post<UserState, typeof params>(userApis.LIST, params)
}
