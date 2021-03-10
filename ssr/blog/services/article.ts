import { post, get } from '@ssr/common/utils'
import type { ServiceResult } from '@ssr/common/types'
import type { IArticle } from '@ssr/blog/types'

enum ArticleApi {
  LIST = '/api/user/article/list',
  DETAIL = '/api/user/article/detail',
  SAVE = '/api/user/article/save',
}

export function getList(params: Partial<IArticle['getListParams']> = {}): ServiceResult<IArticle['getListRes']> {
  return get<IArticle['getListRes']>(ArticleApi.LIST, params)
}

export function getDetail(params: IArticle['getDetailParams']): ServiceResult<IArticle['getDetailRes']> {
  return get<IArticle['getDetailRes']>(ArticleApi.DETAIL, params)
}

export function save(params: IArticle['editParams']): ServiceResult {
  return post<never, typeof params>(ArticleApi.SAVE, params)
}
