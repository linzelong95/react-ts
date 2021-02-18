import { useRef, useEffect } from 'react'

export interface UseTitleOptions {
  restoreOnUnmount?: boolean
}

function useTitle(title: string, options?: UseTitleOptions): void {
  const prevTitleRef = useRef<string>(document?.title || '')

  useEffect(() => {
    if (typeof document !== 'undefined') document.title = title
    return options?.restoreOnUnmount
      ? () => {
          document.title = prevTitleRef.current
        }
      : undefined
  }, [title, options])
}

export default useTitle
