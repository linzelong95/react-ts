import { post } from '@common/utils'
import { categoryApis } from '@blog-admin/services/apis'
import type { CommonResponse, ServiceResult } from '@common/types'
import type { Category } from '@blog-admin/types'

export function getList(params: Category['adminGetListParams'] = {}): ServiceResult<Category['getListRes']> {
  return post<CommonResponse<Category['getListRes']>, typeof params>(categoryApis.ADMIN_LIST, params)
}
