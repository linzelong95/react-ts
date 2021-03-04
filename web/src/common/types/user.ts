export default interface User {
  listItem: {
    id: number
    account: string
    nickName: string
    roleName: 'admin' | 'user'
    avatar?: string
  }
}
