import { UserAction, UserActionType } from '../types'

export const createLogoutAction: () => UserAction = () => ({ type: UserActionType.LOGOUT })

export const createLoginAction: <P = Record<string, unknown>>(params: P) => UserAction<P> = (params) => ({
  type: UserActionType.LOGIN,
  params,
})
