import { post } from '@client/common/utils'
import type { ServiceResult } from '@client/common/types'
import type { ISort } from '@client/blog/types'

enum SortApi {
  LIST = '/api/user/sort/list',
}

export function getList(params: Partial<ISort['getListParams']> = {}): ServiceResult<ISort['getListRes']> {
  return post<ISort['getListRes'], typeof params>(SortApi.LIST, params)
}
