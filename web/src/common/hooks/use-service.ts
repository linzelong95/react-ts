import { useState, useEffect, useCallback } from 'react'
import { CommonResponse, CommonError } from '@common/types'

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
    let mounted = true
    setLoading(true)
    ;(async () => {
      const [res, err] = await service(data)
      if (mounted) {
        setRes(res)
        setErr(err)
        setLoading(false)
      }
    })()
    return () => (mounted = false)
  }, [disabled, flag, data, service])

  const forceRequest = useCallback<() => void>(() => {
    setFlag((prevValue) => !prevValue)
  }, [])

  return [loading, res, err, forceRequest]
}

export default useService
