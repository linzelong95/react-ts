import { post } from '@ssr/common/utils'

enum CosApi {
  AUTH = '/api/cos/auth',
}

export async function getCosSignature(fileKey?: string): Promise<string> {
  const pathname = fileKey || '/'
  const method = fileKey ? 'get' : 'post'
  const [res, err] = await post<{ auth: string }>(CosApi.AUTH, { method, pathname })
  if (!res?.data?.auth) {
    throw err || new Error(res?.message || '获取签名失败')
  }
  return res.data.auth
}
