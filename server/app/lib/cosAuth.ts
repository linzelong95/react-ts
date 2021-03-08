import * as crypto from 'crypto'

function urlEncodeSafely(str: string): string {
  return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A')
}

function transformObjIntoStr(obj: Record<string, string>, encoded?: boolean): string {
  if (typeof obj !== 'object') return ''
  return (
    Object.keys(obj)
      ?.sort?.()
      ?.map?.((key) => {
        const lowerCaseKey = key.toLowerCase()
        const keyValue = obj[key] || ''
        return encoded ? `${urlEncodeSafely(lowerCaseKey)}=${urlEncodeSafely(keyValue)}` : `${lowerCaseKey}=${keyValue}`
      })
      ?.join?.('&') || ''
  )
}

type GetAuthorization = (
  secretId: string,
  secretKey: string,
  params?: Partial<{
    method: string
    pathname: string
    expiredSecond: number
    queries: Record<string, string>
    headers: Record<string, string>
  }>,
) => string

export const getAuthorization: GetAuthorization = (secretId, secretKey, params = {}) => {
  /*
   * 签名算法说明文档：https://www.qcloud.com/document/product/436/7778
   * KeyTime = [Now];[Expires]
   * SignKey = HMAC-SHA1([SecretKey], KeyTime)
   * HttpString = [HttpMethod]\n[HttpURI]\n[HttpParameters]\n[HttpHeaders]\n
   * StringToSign = sha1\nKeyTime\nSHA1(HttpString)\n
   * Signature = HMAC-SHA1(SignKey, StringToSign)
   */

  const { method = 'get', pathname = '/', expiredSecond = 600, queries = {}, headers = {} } = params

  // 步骤1：生成 KeyTime
  const startSecondTime = Math.floor(new Date().getTime() / 1000)
  const endSecondTime = startSecondTime + expiredSecond
  const keyTime = `${startSecondTime};${endSecondTime}`

  // 步骤2：生成 SignKey
  const signKey = crypto.createHmac('sha1', secretKey).update(keyTime).digest('hex')

  // 步骤3：生成 UrlParamList 和 HttpParameters
  // 请求路径：/?prefix=example-folder%2F&delimiter=%2F&max-keys=10
  // UrlParamList：delimiter;max-keys;prefix
  // HttpParameters：delimiter=%2F&max-keys=10&prefix=example-folder%2F
  // 请求路径中的请求参数在实际发送请求时已进行 UrlEncode，这里不需要执行 UrlEncode
  const urlParamList =
    Object.keys(queries)
      ?.map?.((key) => key.toLowerCase())
      ?.sort()
      ?.join(';') || ''
  const httpParameters = transformObjIntoStr(queries)

  // 步骤4：生成 HeaderList 和 HttpHeaders（key 使用 UrlEncode 编码并转换为小写形式，value 使用 UrlEncode 编码。）
  // 请求头部示例
  // Host: examplebucket-1250000000.cos.ap-shanghai.myqcloud.com
  // Date: Thu, 16 May 2019 03:15:06 GMT
  // x-cos-acl: private
  // x-cos-grant-read: uin="100000000011"
  // 计算：
  // HeaderList = date;host;x-cos-acl;x-cos-grant-read
  // HttpHeaders = date=Thu%2C%2016%20May%202019%2003%3A15%3A06%20GMT&host=examplebucket-1250000000.cos.ap-shanghai.myqcloud.com&x-cos-acl=private&x-cos-grant-read=uin%3D%22100000000011%22
  const headerList =
    Object.keys(headers)
      ?.map?.((key) => key.toLowerCase())
      ?.sort()
      ?.join(';') || ''
  const httpHeaders = transformObjIntoStr(headers, true)

  // 步骤5：生成 HttpString
  // HttpMethod 转换为小写，例如 get 或 put
  const httpMethod = method.toLowerCase()
  // UriPathname 为请求路径，例如/或/exampleobject
  const uriPathname = pathname.startsWith('/') ? pathname : `/${pathname}`
  // 格式为HttpMethod\nUriPathname\nHttpParameters\nHttpHeaders\n
  // \n为换行符。如果其中有字符串为空，前后的换行符需要保留，例如get\n/exampleobject\n\n\n
  const httpString = [httpMethod, uriPathname, httpParameters, httpHeaders, ''].join('\n')

  // 步骤6：生成 StringToSign(格式为sha1\nKeyTime\nSHA1(HttpString)\n)
  const stringToSign = ['sha1', keyTime, crypto.createHash('sha1').update(httpString).digest('hex'), ''].join('\n')

  // 步骤7：生成 Signature
  const signature = crypto.createHmac('sha1', signKey).update(stringToSign).digest('hex')

  // 返回完整的签名算法
  return [
    'q-sign-algorithm=sha1',
    `q-ak=${secretId}`,
    `q-sign-time=${keyTime}`,
    `q-key-time=${keyTime}`,
    `q-header-list=${headerList}`,
    `q-url-param-list=${urlParamList}`,
    `q-signature=${signature}`,
  ].join('&')
}
