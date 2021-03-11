import { post } from '@common/utils'
import type { ServiceResult } from '@common/types'
import type { IMessage } from '@b-blog/types'

enum MessageApi {
  LIST = '/api/admin/message/list',
  SAVE = '/api/admin/message/save',
  DELETE = '/api/admin/message/delete',
  TOP = '/api/admin/message/top',
  UNTOP = '/api/admin/message/unTop',
  APPROVE = '/api/admin/message/approve',
  DISAPPROVE = '/api/admin/message/disapprove',
}

export function getList(params: Partial<IMessage['getListParams']> = {}): ServiceResult<IMessage['getListRes']> {
  return post<IMessage['getListRes'], typeof params>(MessageApi.LIST, params)
}

export function save(params: IMessage['editParams']): ServiceResult {
  return post<never, typeof params>(MessageApi.SAVE, params)
}

export function remove(params: IMessage['removeParams']): ServiceResult {
  return post<never, typeof params>(MessageApi.DELETE, params)
}

export function top(params: IMessage['topParams']): ServiceResult {
  return post<never, typeof params>(MessageApi.TOP, params)
}

export function unTop(params: IMessage['unTopParams']): ServiceResult {
  return post<never, typeof params>(MessageApi.UNTOP, params)
}

export function approve(params: IMessage['approveParams']): ServiceResult {
  return post<never, typeof params>(MessageApi.APPROVE, params)
}

export function disapprove(params: IMessage['disapproveParams']): ServiceResult {
  return post<never, typeof params>(MessageApi.DISAPPROVE, params)
}
