export default interface IUser {
  listItem: {
    id: number
    account: string
    nickname: string
    roleName: 'admin' | 'user'
    avatar?: string
    github?: string
  }
  getListRes: {
    list: IUser['listItem'][]
    total: number
  }
  getListParams: {
    page?: number
    size?: number
    id?: number
    search?: string
  }
}
