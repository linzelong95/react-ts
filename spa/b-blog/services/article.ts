import { post } from '@common/utils'
import type { ServiceResult } from '@common/types'
import type { IArticle } from '@b-blog/types'

enum ArticleApi {
  LIST = '/api/admin/article/list',
  CONTENT = '/api/admin/article/content',
  SAVE = '/api/admin/article/save',
  DELETE = '/api/admin/article/delete',
  LOCK = '/api/admin/article/lock',
  UNLOCK = '/api/admin/article/unlock',
  TOP = '/api/admin/article/top',
  UNTOP = '/api/admin/article/unTop',
}

export function getList(params: Partial<IArticle['getListParams']> = {}): ServiceResult<IArticle['getListRes']> {
  return post<IArticle['getListRes'], typeof params>(ArticleApi.LIST, params)
}

export function getContent(params: { articleId: number }): ServiceResult<string> {
  return post<string, typeof params>(ArticleApi.CONTENT, params)
}

export function save(params: IArticle['editParams']): ServiceResult {
  return post<never, typeof params>(ArticleApi.SAVE, params)
}

export function remove(params: IArticle['removeParams']): ServiceResult {
  return post<never, typeof params>(ArticleApi.DELETE, params)
}

export function lock(params: IArticle['lockParams']): ServiceResult {
  return post<never, typeof params>(ArticleApi.LOCK, params)
}

export function unlock(params: IArticle['unlockParams']): ServiceResult {
  return post<never, typeof params>(ArticleApi.UNLOCK, params)
}

export function top(params: IArticle['topParams']): ServiceResult {
  return post<never, typeof params>(ArticleApi.TOP, params)
}

export function unTop(params: IArticle['unTopParams']): ServiceResult {
  return post<never, typeof params>(ArticleApi.UNTOP, params)
}
