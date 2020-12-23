import { get } from '@common/utils'
import { CommonError, CommonResponse } from '@common/types'

export async function getSomethingList<Res>(name?: string): Promise<[CommonResponse<Res>, null] | [null, CommonError]> {
  return get<CommonResponse<Res>>('/api/xx', { params: { name } })
}
