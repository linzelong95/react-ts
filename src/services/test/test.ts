import { get } from '@common/utils'
import { CommonError, CommonResponse } from '@common/types'
import { GetSomethingListRes } from '@type/test'

export async function getSomethingList(name?: string): Promise<[CommonResponse<GetSomethingListRes>, null] | [null, CommonError]> {
  return get<CommonResponse<GetSomethingListRes>>('/api/xx', { params: { name } })
}
