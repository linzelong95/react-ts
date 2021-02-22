import { post } from '@common/utils'
import { sortApis } from '@blog-admin/services/apis'
import type { ServiceResult, CommonResponse } from '@common/types'
import type { Sort } from '@blog-admin/types'

export function getList(params: Partial<Sort['getListParamsByAdminRole']> = {}): ServiceResult<Sort['getListResByAdminRole']> {
  return post<CommonResponse<Sort['getListResByAdminRole']>, typeof params>(sortApis.ADMIN_LIST, params)
}

export function save(params: Sort['editParams']): ServiceResult {
  return post<CommonResponse, typeof params>(sortApis.ADMIN_SAVE, params)
}

export function remove(params: Sort['removeParams']): ServiceResult {
  return post<CommonResponse, typeof params>(sortApis.ADMIN_DELETE, params)
}

export function lock(params: Sort['lockParams']): ServiceResult {
  return post<CommonResponse, typeof params>(sortApis.ADMIN_LOCK, params)
}

export function unlock(params: Sort['unlockParams']): ServiceResult {
  return post<CommonResponse, typeof params>(sortApis.ADMIN_UNLOCK, params)
}
