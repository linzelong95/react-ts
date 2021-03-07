import { post } from '@client/common/utils'
import type { ServiceResult } from '@client/common/types'
import type { ITag } from '@client/blog/types'

enum TagApi {
  LIST = '/api/user/tag/list',
}

export function getList(params: Partial<ITag['getListParams']> = {}): ServiceResult<ITag['getListRes']> {
  return post<ITag['getListRes'], typeof params>(TagApi.LIST, params)
}
