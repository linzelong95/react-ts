import { post } from '@common/utils'
import { sortApis } from '@blog-admin/services/apis'
import type { ServiceResult, CommonResponse } from '@common/types'
import type { Sort } from '@blog-admin/types'

export function getList(params: Sort['adminGetListParams'] = {}): ServiceResult<Sort['getListRes']> {
  return post<CommonResponse<Sort['getListRes']>, typeof params>(sortApis.ADMIN_LIST, params)
}
