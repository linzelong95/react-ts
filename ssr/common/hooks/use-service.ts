import { useState, useEffect, useCallback } from 'react'
import type { CommonResponse, CommonError } from '@ssr/common/types'

function useService<R extends unknown, D extends unknown>(
  service: (params: D) => Promise<[CommonResponse<R>, CommonError]>,
  data?: D,
  disabled?: boolean,
): [boolean, CommonResponse<R>, CommonError, () => void] {
  const [flag, setFlag] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(() => !disabled)
  const [res, setRes] = useState<CommonResponse<R>>(null)
  const [err, setErr] = useState<CommonError>(null)

  useEffect(() => {
    if (disabled) return
    setLoading(true)
    ;(async () => {
      const [res, err] = await service(data)
      setRes(res)
      setErr(err)
      setLoading(false)
    })()
  }, [disabled, flag, data, service])

  const forceRequest = useCallback<() => void>(() => {
    setFlag((prevValue) => !prevValue)
  }, [])

  return [loading, res, err, forceRequest]
}

export default useService
