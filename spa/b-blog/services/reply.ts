import { post } from '@common/utils'
import type { ServiceResult } from '@common/types'
import type { IReply } from '@b-blog/types'

enum ReplyApi {
  LIST = '/api/admin/reply/list',
  SAVE = '/api/admin/reply/save',
  DELETE = '/api/admin/reply/delete',
  TOP = '/api/admin/reply/top',
  UNTOP = '/api/admin/reply/unTop',
  APPROVE = '/api/admin/reply/approve',
  DISAPPROVE = '/api/admin/reply/disapprove',
}

export function getList(params: Partial<IReply['getListParams']> = {}): ServiceResult<IReply['getListRes']> {
  return post<IReply['getListRes'], typeof params>(ReplyApi.LIST, params)
}

export function save(params: IReply['editParams']): ServiceResult {
  return post<never, typeof params>(ReplyApi.SAVE, params)
}

export function remove(params: IReply['removeParams']): ServiceResult {
  return post<never, typeof params>(ReplyApi.DELETE, params)
}

export function top(params: IReply['topParams']): ServiceResult {
  return post<never, typeof params>(ReplyApi.TOP, params)
}

export function unTop(params: IReply['unTopParams']): ServiceResult {
  return post<never, typeof params>(ReplyApi.UNTOP, params)
}

export function approve(params: IReply['approveParams']): ServiceResult {
  return post<never, typeof params>(ReplyApi.APPROVE, params)
}

export function disapprove(params: IReply['disapproveParams']): ServiceResult {
  return post<never, typeof params>(ReplyApi.DISAPPROVE, params)
}
