import { post } from '@ssr/common/utils'
import { cosApis } from '@ssr/common/services/apis'

export async function getCosSignature(fileKey?: string): Promise<string> {
  const pathname = fileKey || '/'
  const method = fileKey ? 'get' : 'post'
  const [res, err] = await post<{ auth: string }>(cosApis.COS_AUTH, { method, pathname })
  if (!res?.data?.auth) {
    throw err || new Error(res?.message || '获取签名失败')
  }
  return res.data.auth
}
