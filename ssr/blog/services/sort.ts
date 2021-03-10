import { get } from '@ssr/common/utils'
import type { ServiceResult } from '@ssr/common/types'
import type { ISort } from '@ssr/blog/types'

enum SortApi {
  LIST = '/api/user/sort/list',
}

export function getList(params: Partial<ISort['getListParams']> = {}): ServiceResult<ISort['getListRes']> {
  return get<ISort['getListRes']>(SortApi.LIST, params)
}
