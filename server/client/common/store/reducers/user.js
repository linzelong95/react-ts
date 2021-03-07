import { LOGOUT } from '../action/user'

export const initialUserState = {}

function reducer(state = initialUserState, action) {
  switch (action.type) {
    case LOGOUT:
      return {}
    default:
      return state
  }
}

export default reducer
