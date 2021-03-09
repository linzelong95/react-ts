import { useEffect, useState } from 'react'
import { isClient, isMobile } from '@ssr/common/utils'
import { useMedia } from '@ssr/common/hooks'

export interface UseMobileParams {
  initialValue?: boolean
  includePad?: boolean
  includeTraditionalSmallViewPort?: boolean | number
}

function useMobile(params: UseMobileParams = {}): boolean {
  const { includePad, includeTraditionalSmallViewPort, initialValue } = params
  const extraMaxWith = typeof includeTraditionalSmallViewPort === 'number' ? includeTraditionalSmallViewPort : 575
  const isSmallViewPort = useMedia(`(max-width: ${extraMaxWith}px)`)
  const isMobileType = isMobile(includePad)
  const [state, setState] = useState<boolean>(isClient ? Boolean(initialValue) : false)
  useEffect(() => {
    if (!isClient) return
    setState(includeTraditionalSmallViewPort ? isSmallViewPort || isMobileType : isMobileType)
  }, [includeTraditionalSmallViewPort, isSmallViewPort, isMobileType])

  return state
}

export default useMobile
