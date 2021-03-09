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
