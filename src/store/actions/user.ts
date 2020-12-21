import axios from 'axios'
import { Dispatch } from 'react'
import { UserAction, UserActionType } from '../types'

const createLogoutAction: () => UserAction = () => ({ type: UserActionType.LOGOUT })

function logout(): (dispatch: Dispatch<UserAction>) => void {
  return (dispatch: Dispatch<UserAction>) => {
    axios
      .post('/logout')
      .then(() => dispatch(createLogoutAction()))
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {})
  }
}

export { logout }
