export enum UserActionType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export interface UserState {
  username?: string
  account: string
  nickName: string
  roleName: 'admin' | 'user'
}

export interface UserAction {
  type: UserActionType
  params?: UserState
}
