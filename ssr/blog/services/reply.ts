import { get, post } from '@ssr/common/utils'
import type { ServiceResult } from '@ssr/common/types'
import type { IReply } from '@ssr/blog/types'

enum ReplyApi {
  LIST = '/api/user/reply/list',
  SAVE = '/api/user/reply/save',
  DELETE = '/api/user/reply/delete',
  TOP = '/api/user/reply/top',
  UNTOP = '/api/user/reply/unTop',
  APPROVE = '/api/user/reply/approve',
  DISAPPROVE = '/api/user/reply/disapprove',
}

export function getList(params: Partial<IReply['getListParams']> = {}): ServiceResult<IReply['getListRes']> {
  return get<IReply['getListRes']>(ReplyApi.LIST, params)
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
