import { get } from '@ssr/common/utils'
import type { ServiceResult } from '@ssr/common/types'
import type { ITag } from '@ssr/blog/types'

enum TagApi {
  LIST = '/api/user/tag/list',
}

export function getList(params: Partial<ITag['getListParams']> = {}): ServiceResult<ITag['getListRes']> {
  return get<ITag['getListRes']>(TagApi.LIST, params)
}
