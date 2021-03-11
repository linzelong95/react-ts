import { post } from '@common/utils'
import type { ServiceResult } from '@common/types'
import type { ISort } from '@b-blog/types'

enum SortApi {
  LIST = '/api/admin/sort/list',
  SAVE = '/api/admin/sort/save',
  DELETE = '/api/admin/sort/delete',
  LOCK = '/api/admin/sort/lock',
  UNLOCK = '/api/admin/sort/unlock',
}

export function getList(params: Partial<ISort['getListParams']> = {}): ServiceResult<ISort['getListRes']> {
  return post<ISort['getListRes'], typeof params>(SortApi.LIST, params)
}

export function save(params: ISort['editParams']): ServiceResult {
  return post<never, typeof params>(SortApi.SAVE, params)
}

export function remove(params: ISort['removeParams']): ServiceResult {
  return post<never, typeof params>(SortApi.DELETE, params)
}

export function lock(params: ISort['lockParams']): ServiceResult {
  return post<never, typeof params>(SortApi.LOCK, params)
}

export function unlock(params: ISort['unlockParams']): ServiceResult {
  return post<never, typeof params>(SortApi.UNLOCK, params)
}
