import { post } from '@common/utils'
import { categoryApis } from '@blog-admin/services/apis'
import type { ServiceResult } from '@common/types'
import type { Category } from '@blog-admin/types'

export function getList(params: Partial<Category['getListParamsByAdminRole']> = {}): ServiceResult<Category['getListResByAdminRole']> {
  return post<Category['getListResByAdminRole'], typeof params>(categoryApis.ADMIN_LIST, params)
}

export function save(params: Category['editParams']): ServiceResult {
  return post<never, typeof params>(categoryApis.ADMIN_SAVE, params)
}

export function remove(params: Category['removeParams']): ServiceResult {
  return post<never, typeof params>(categoryApis.ADMIN_DELETE, params)
}

export function lock(params: Category['lockParams']): ServiceResult {
  return post<never, typeof params>(categoryApis.ADMIN_LOCK, params)
}

export function unlock(params: Category['unlockParams']): ServiceResult {
  return post<never, typeof params>(categoryApis.ADMIN_UNLOCK, params)
}
