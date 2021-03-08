import { post } from '@common/utils'
import { messageApis } from '@blog-admin/services/apis'
import type { ServiceResult } from '@common/types'
import type { Message } from '@blog-admin/types'

export function getList(params: Partial<Message['getListParamsByAdminRole']> = {}): ServiceResult<Message['getListResByAdminRole']> {
  return post<Message['getListResByAdminRole'], typeof params>(messageApis.ADMIN_LIST, params)
}

export function save(params: Message['editParams']): ServiceResult {
  return post<never, typeof params>(messageApis.ADMIN_SAVE, params)
}

export function remove(params: Message['removeParams']): ServiceResult {
  return post<never, typeof params>(messageApis.ADMIN_DELETE, params)
}

export function top(params: Message['topParams']): ServiceResult {
  return post<never, typeof params>(messageApis.ADMIN_TOP, params)
}

export function unTop(params: Message['unTopParams']): ServiceResult {
  return post<never, typeof params>(messageApis.ADMIN_UNTOP, params)
}

export function approve(params: Message['approveParams']): ServiceResult {
  return post<never, typeof params>(messageApis.ADMIN_APPROVE, params)
}

export function disapprove(params: Message['disapproveParams']): ServiceResult {
  return post<never, typeof params>(messageApis.ADMIN_DISAPPROVE, params)
}
