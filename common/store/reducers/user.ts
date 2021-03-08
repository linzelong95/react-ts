import { UserState, UserAction, UserActionType } from '../types'

export const initialUserState = ((window as any).__INITIAL_STATE__?.user || {}) as UserState | Record<string, never>

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
