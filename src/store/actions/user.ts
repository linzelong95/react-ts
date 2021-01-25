import { UserAction, UserActionType, UserState } from '../types'

export const createLogoutAction: () => UserAction = () => ({ type: UserActionType.LOGOUT })

export const createLoginAction: (params: UserState) => UserAction = (params) => ({
  type: UserActionType.LOGIN,
  params,
})
