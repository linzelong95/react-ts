import { useEffect, useState } from 'react'
import { isClient } from '@common/utils'

function useMedia(query: string, defaultState?: boolean): boolean {
  const [state, setState] = useState(
    isClient ? () => window.matchMedia(query).matches : Boolean(defaultState),
  )

  useEffect(() => {
    if (!isClient) return
    let mounted = true
    const mediaQueryList = window.matchMedia(query)
    const onChange = () => {
      if (mounted) setState(!!mediaQueryList.matches)
    }
    mediaQueryList.addEventListener('change', onChange)
    setState(mediaQueryList.matches)

    return () => {
      mounted = false
      mediaQueryList.removeEventListener('change', onChange)
    }
  }, [query])

  return state
}

export default useMedia
