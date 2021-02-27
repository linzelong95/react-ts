import { useState, useEffect, useCallback } from 'react'
import { CommonResponse, CommonError } from '@common/types'

function useService<R extends unknown, D extends unknown>(
  service: (params: D) => Promise<[CommonResponse<R>, CommonError]>,
  data: D,
): [boolean, CommonResponse<R>, CommonError, () => void] {
  const [flag, setFlag] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [res, setRes] = useState<CommonResponse<R>>(null)
  const [err, setErr] = useState<CommonError>(null)

  useEffect(() => {
    setLoading(true)
    ;(async () => {
      const [res, err] = await service(data)
      setRes(res)
      setErr(err)
      setLoading(false)
    })()
  }, [flag, data, service])

  const forceRequest = useCallback<() => void>(() => {
    setFlag((prevValue) => !prevValue)
  }, [])

  return [loading, res, err, forceRequest]
}

export default useService
