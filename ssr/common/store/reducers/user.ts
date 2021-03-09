// import { isClient } from '@common/utils'
import { UserState, UserAction, UserActionType } from '../types'

// 注意ssr渲染，window不存在
export const initialUserState = ((typeof window === 'object' && (window as any).__INITIAL_STATE__?.user) || {}) as
  | UserState
  | Record<string, never>

function reducer(state = initialUserState, action: UserAction): UserState | Record<string, never> {
  switch (action.type) {
    case UserActionType.LOGOUT:
      return {}
    case UserActionType.LOGIN:
      return action.params
    default:
      return state
  }
}

export default reducer
