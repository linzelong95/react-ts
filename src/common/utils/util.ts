import md5 from 'crypto-js/md5'
import hex from 'crypto-js/enc-hex'
import JSEncrypt from 'jsencrypt'

/**
 * tryCatch return Promise<[R, Error]>
 * @param {Promise<R>} promise
 */
export async function tryCatch<R, E = Error>(promise: Promise<R> | R): Promise<[R, null] | [null, E]> {
  try {
    const res: R = await promise
    return [res, null]
  } catch (error) {
    return [null, error]
  }
}

// 判断是否是客户端
export const isClient = typeof window === 'object'

// md5序列化
export function serialize(value: string): string {
  return md5(value.toString()).toString(hex).replace('-', '')
}

// RSA加密
export function rsa(value: string, publicKey: string): string {
  const Encrypt = new JSEncrypt()
  Encrypt.setPublicKey(publicKey)
  return Encrypt.encrypt(value)
}

// RSA解密
export function rsaBack(value: string, PrivateKey: string): string {
  const Encrypt = new JSEncrypt()
  Encrypt.setPrivateKey(PrivateKey)
  return Encrypt.decrypt(value)
}
