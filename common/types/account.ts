export default interface Account {
  registerParams: {
    account: string
    password: string
  }
  loginParams: {
    account?: string
    password?: string
    captcha?: string
    autoLogin: boolean
  }
}
