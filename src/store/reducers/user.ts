import { UserState, UserAction, UserActionType } from '../types'

export const initialUserState: UserState = {} as UserState

function reducer(state = initialUserState, action: UserAction): UserState {
  switch (action.type) {
    case UserActionType.LOGOUT:
      return initialUserState
    default:
      return state
  }
}

export default reducer
