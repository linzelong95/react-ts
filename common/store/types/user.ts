export enum UserActionType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export interface UserState {
  id: number
  account: string
  nickname: string
  roleName: 'admin' | 'user'
  avatar: string
}

export interface UserAction {
  type: UserActionType
  params?: UserState
}
