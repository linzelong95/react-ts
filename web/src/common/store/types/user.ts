export enum UserActionType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export interface UserState {
  account: string
  nickName: string
  roleName: 'admin' | 'user'
}

export interface UserAction {
  type: UserActionType
  params?: UserState
}
