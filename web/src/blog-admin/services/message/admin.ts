import { post } from '@common/utils'
import { messageApis } from '@blog-admin/services/apis'
import type { ServiceResult, CommonResponse } from '@common/types'
import type { Message } from '@blog-admin/types'

export function getList(params: Partial<Message['getListParamsByAdminRole']> = {}): ServiceResult<Message['getListResByAdminRole']> {
  return post<CommonResponse<Message['getListResByAdminRole']>, typeof params>(messageApis.ADMIN_LIST, params)
}

export function save(params: Message['editParams']): ServiceResult {
  return post<CommonResponse, typeof params>(messageApis.ADMIN_SAVE, params)
}

export function remove(params: Message['removeParams']): ServiceResult {
  return post<CommonResponse, typeof params>(messageApis.ADMIN_DELETE, params)
}

export function top(params: Message['lockParams']): ServiceResult {
  return post<CommonResponse, typeof params>(messageApis.ADMIN_TOP, params)
}

export function unTop(params: Message['unlockParams']): ServiceResult {
  return post<CommonResponse, typeof params>(messageApis.ADMIN_UNTOP, params)
}

export function approve(params: Message['lockParams']): ServiceResult {
  return post<CommonResponse, typeof params>(messageApis.ADMIN_APPROVE, params)
}

export function disapprove(params: Message['unlockParams']): ServiceResult {
  return post<CommonResponse, typeof params>(messageApis.ADMIN_DISAPPROVE, params)
}
