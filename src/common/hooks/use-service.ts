/**
 * useService hook
 */
import { useState, useEffect } from 'react'
import { CommonError } from '@common/types'

/**
 * 将普通的 Service Function 转换成 hook
 * @param {Service}  service 请求方法
 * @param {...any[]} data    该 service 方法所需要的参数
 */
export function useService<T extends any, D extends any[]>(
  service: (...data: D) => Promise<[T, CommonError]>,
  ...data: D
): [boolean, T, CommonError, () => void] {
  const [flag, setFlag] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [res, setRes] = useState<[T, CommonError]>(([null, null] as unknown) as [T, CommonError])

  useEffect(() => {
    setLoading(true)
    ;(async () => {
      const res = await service(...data)
      setRes(res)
      setLoading(false)
    })()
  }, [...data, flag])

  // 某些时候，我们需要在数据不变更的情况下手动去触发请求,可以调用该方法
  const forceRequest = () => setFlag((prevFlag) => prevFlag + 1)

  return [loading, res[0], res[1], forceRequest]
}
