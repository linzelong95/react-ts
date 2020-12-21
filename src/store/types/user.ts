export enum UserActionType {
  LOGOUT = 'LOGOUT',
}

export interface UserState {
  username?: string
  [key: string]: any // TODO:待确定具体字段
}

export interface UserAction {
  type: UserActionType
  params?: Record<string, any> // TODO:待确定具体字段
}
