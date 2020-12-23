/**
 * 公共工具方法
 */

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
