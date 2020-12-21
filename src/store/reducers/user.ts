import { UserState, UserAction, UserActionType } from '../types'

export const initialUserState: UserState = {
  username: 'linzelong',
}

function reducer(state = initialUserState, action: UserAction): UserState {
  switch (action.type) {
    case UserActionType.LOGOUT:
      return {}
    default:
      return state
  }
}

export default reducer
