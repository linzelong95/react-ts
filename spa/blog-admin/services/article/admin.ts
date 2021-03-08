import { post } from '@common/utils'
import { articleApis } from '@blog-admin/services/apis'
import type { ServiceResult } from '@common/types'
import type { ArticleTypeCollection } from '@blog-admin/types'

export function getList(
  params: Partial<ArticleTypeCollection['getListParamsByAdminRole']> = {},
): ServiceResult<ArticleTypeCollection['getListResByAdminRole']> {
  return post<ArticleTypeCollection['getListResByAdminRole'], typeof params>(articleApis.ADMIN_LIST, params)
}

export function getContent(params: { articleId: number }): ServiceResult<string> {
  return post<string, typeof params>(articleApis.ADMIN_CONTENT, params)
}

export function save(params: ArticleTypeCollection['editParams']): ServiceResult {
  return post<never, typeof params>(articleApis.ADMIN_SAVE, params)
}

export function remove(params: ArticleTypeCollection['removeParams']): ServiceResult {
  return post<never, typeof params>(articleApis.ADMIN_DELETE, params)
}

export function lock(params: ArticleTypeCollection['lockParams']): ServiceResult {
  return post<never, typeof params>(articleApis.ADMIN_LOCK, params)
}

export function unlock(params: ArticleTypeCollection['unlockParams']): ServiceResult {
  return post<never, typeof params>(articleApis.ADMIN_UNLOCK, params)
}

export function top(params: ArticleTypeCollection['topParams']): ServiceResult {
  return post<never, typeof params>(articleApis.ADMIN_TOP, params)
}

export function unTop(params: ArticleTypeCollection['unTopParams']): ServiceResult {
  return post<never, typeof params>(articleApis.ADMIN_UNTOP, params)
}
