import { post } from '@common/utils'
import { sortApis } from '@blog-admin/services/apis'
import type { ServiceResult, CommonResponse } from '@common/types'
import type { Sort } from '@blog-admin/types'

export function getList(params: Partial<Sort['getListParamsByAdminRole']> = {}): ServiceResult<Sort['getListResByAdminRole']> {
  return post<CommonResponse<Sort['getListResByAdminRole']>, typeof params>(sortApis.ADMIN_LIST, params)
}

export function insert(params: Sort['insertParams']): ServiceResult {
  return post<CommonResponse, typeof params>(sortApis.ADMIN_INSERT, params)
}
