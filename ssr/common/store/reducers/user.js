import { LOGOUT } from '../action/user'

function reducer(state = {}, action) {
  switch (action.type) {
    case LOGOUT:
      return {}
    default:
      return state
  }
}

export default reducer
