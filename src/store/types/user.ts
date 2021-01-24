export enum UserActionType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export interface UserState {
  username?: string
  account: string
  nickName: string
  roleName: string
}

export interface UserAction<P = Record<string, unknown>> {
  type: UserActionType
  params?: P
}
