import { useState, useCallback, Dispatch, SetStateAction, useMemo } from 'react'
import { isClient } from '../utils'

type parserOptions<T> =
  | {
      raw: true
    }
  | {
      raw: false
      serializer: (value: T) => string
      deserializer: (value: string) => T
    }

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const useLocalStorage = <T>(
  key: string,
  initialValue?: T,
  options?: parserOptions<T>,
): [T | undefined, Dispatch<SetStateAction<T | undefined>>, () => void] => {
  if (!isClient) {
    return [initialValue as T, noop, noop]
  }
  if (!key) {
    throw new Error('useLocalStorage key may not be falsy')
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const deserializer = useMemo(() => {
    if (!options) return JSON.parse
    return options.raw ? (value) => value : (options as any).deserializer
  }, [options])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const serializer = useMemo(() => {
    if (!options) return JSON.stringify
    return options.raw ? String : (options as any).serializer
  }, [options])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [state, setState] = useState<T | undefined>(() => {
    try {
      const localStorageValue = localStorage.getItem(key)
      if (localStorageValue !== null) {
        return deserializer(localStorageValue)
      } else {
        initialValue && localStorage.setItem(key, serializer(initialValue))
        return initialValue
      }
    } catch {
      return initialValue
    }
  })

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const set = useCallback<Dispatch<SetStateAction<T | undefined>>>(
    (valOrFunc) => {
      try {
        const newState = typeof valOrFunc === 'function' ? (valOrFunc as (prevState: T) => T)(state) : valOrFunc
        if (typeof newState === 'undefined') return
        let value: string
        if (options) {
          if (options.raw) {
            value = typeof newState === 'string' ? newState : JSON.stringify(newState)
          } else {
            value = (options as any).serializer ? (options as any).serializer(newState) : JSON.stringify(newState)
          }
        } else {
          value = JSON.stringify(newState)
        }

        localStorage.setItem(key, value)
        setState(deserializer(value))
      } catch {}
    },
    [key, state, options, setState, deserializer],
  )

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const remove = useCallback<() => void>(() => {
    try {
      localStorage.removeItem(key)
      setState(undefined)
    } catch {}
  }, [key, setState])

  return [state, set, remove]
}

export default useLocalStorage
