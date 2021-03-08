export default interface IUser {
  listItem: {
    id: number
    account: string
    nickName: string
    roleName: 'admin' | 'user'
    avatar?: string
  }
}
