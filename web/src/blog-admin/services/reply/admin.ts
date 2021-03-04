import { post } from '@common/utils'
import { replyApis } from '@blog-admin/services/apis'
import type { ServiceResult } from '@common/types'
import type { ReplyTypeCollection } from '@blog-admin/types'

export function getList(
  params: Partial<ReplyTypeCollection['getListParamsByAdminRole']> = {},
): ServiceResult<ReplyTypeCollection['getListResByAdminRole']> {
  return post<ReplyTypeCollection['getListResByAdminRole'], typeof params>(replyApis.ADMIN_LIST, params)
}

export function save(params: ReplyTypeCollection['editParams']): ServiceResult {
  return post<never, typeof params>(replyApis.ADMIN_SAVE, params)
}

export function remove(params: ReplyTypeCollection['removeParams']): ServiceResult {
  return post<never, typeof params>(replyApis.ADMIN_DELETE, params)
}

export function top(params: ReplyTypeCollection['topParams']): ServiceResult {
  return post<never, typeof params>(replyApis.ADMIN_TOP, params)
}

export function unTop(params: ReplyTypeCollection['unTopParams']): ServiceResult {
  return post<never, typeof params>(replyApis.ADMIN_UNTOP, params)
}

export function approve(params: ReplyTypeCollection['approveParams']): ServiceResult {
  return post<never, typeof params>(replyApis.ADMIN_APPROVE, params)
}

export function disapprove(params: ReplyTypeCollection['disapproveParams']): ServiceResult {
  return post<never, typeof params>(replyApis.ADMIN_DISAPPROVE, params)
}
