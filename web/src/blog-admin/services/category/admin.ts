import { post } from '@common/utils'
import { categoryApis } from '@blog-admin/services/apis'
import type { CommonResponse, ServiceResult } from '@common/types'
import type { Category } from '@blog-admin/types'

export function getList(params: Partial<Category['getListParamsByAdminRole']> = {}): ServiceResult<Category['getListResByAdminRole']> {
  return post<CommonResponse<Category['getListResByAdminRole']>, typeof params>(categoryApis.ADMIN_LIST, params)
}

export function insert(params: Category['insertParams']): ServiceResult {
  return post<CommonResponse, typeof params>(categoryApis.ADMIN_INSERT, params)
}
