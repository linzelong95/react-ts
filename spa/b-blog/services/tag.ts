import { post } from '@common/utils'
import type { ServiceResult } from '@common/types'
import type { ITag } from '@b-blog/types'

enum TagApi {
  LIST = '/api/admin/tag/list',
  SAVE = '/api/admin/tag/save',
  DELETE = '/api/admin/tag/delete',
  LOCK = '/api/admin/tag/lock',
  UNLOCK = '/api/admin/tag/unlock',
}

export function getList(params: Partial<ITag['getListParams']> = {}): ServiceResult<ITag['getListRes']> {
  return post<ITag['getListRes'], typeof params>(TagApi.LIST, params)
}

export function save(params: ITag['editParams']): ServiceResult {
  return post<never, typeof params>(TagApi.SAVE, params)
}

export function remove(params: ITag['removeParams']): ServiceResult {
  return post<never, typeof params>(TagApi.DELETE, params)
}

export function lock(params: ITag['lockParams']): ServiceResult {
  return post<never, typeof params>(TagApi.LOCK, params)
}

export function unlock(params: ITag['unlockParams']): ServiceResult {
  return post<never, typeof params>(TagApi.UNLOCK, params)
}
