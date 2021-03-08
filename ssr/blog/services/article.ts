import { post } from '@ssr/common/utils'
import type { ServiceResult } from '@ssr/common/types'
import type { IArticle } from '@ssr/blog/types'

enum ArticleApi {
  LIST = '/api/user/article/list',
  CONTENT = '/api/user/article/content',
  SAVE = '/api/user/article/save',
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