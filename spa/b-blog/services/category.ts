import { post } from '@common/utils'
import type { ServiceResult } from '@common/types'
import type { ICategory } from '@b-blog/types'

enum CategoryApi {
  LIST = '/api/admin/cate/list',
  SAVE = '/api/admin/cate/save',
  DELETE = '/api/admin/cate/delete',
  LOCK = '/api/admin/cate/lock',
  UNLOCK = '/api/admin/cate/unlock',
}

export function getList(params: Partial<ICategory['getListParams']> = {}): ServiceResult<ICategory['getListRes']> {
  return post<ICategory['getListRes'], typeof params>(CategoryApi.LIST, params)
}

export function save(params: ICategory['editParams']): ServiceResult {
  return post<never, typeof params>(CategoryApi.SAVE, params)
}

export function remove(params: ICategory['removeParams']): ServiceResult {
  return post<never, typeof params>(CategoryApi.DELETE, params)
}

export function lock(params: ICategory['lockParams']): ServiceResult {
  return post<never, typeof params>(CategoryApi.LOCK, params)
}

export function unlock(params: ICategory['unlockParams']): ServiceResult {
  return post<never, typeof params>(CategoryApi.UNLOCK, params)
}
