import { post } from '@common/utils'
import { tagApis } from '@b-blog/services/apis'
import type { ServiceResult } from '@common/types'
import type { TagTypeCollection } from '@b-blog/types'

export function getList(
  params: Partial<TagTypeCollection['getListParamsByAdminRole']> = {},
): ServiceResult<TagTypeCollection['getListResByAdminRole']> {
  return post<TagTypeCollection['getListResByAdminRole'], typeof params>(tagApis.ADMIN_LIST, params)
}

export function save(params: TagTypeCollection['editParams']): ServiceResult {
  return post<never, typeof params>(tagApis.ADMIN_SAVE, params)
}

export function remove(params: TagTypeCollection['removeParams']): ServiceResult {
  return post<never, typeof params>(tagApis.ADMIN_DELETE, params)
}

export function lock(params: TagTypeCollection['lockParams']): ServiceResult {
  return post<never, typeof params>(tagApis.ADMIN_LOCK, params)
}

export function unlock(params: TagTypeCollection['unlockParams']): ServiceResult {
  return post<never, typeof params>(tagApis.ADMIN_UNLOCK, params)
}
