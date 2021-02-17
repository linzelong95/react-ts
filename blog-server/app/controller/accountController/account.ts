import { Controller } from 'egg'
import { getRepository } from 'typeorm'
import { User } from '../../../entity/User'
import * as crypto from 'crypto'
import * as constants from 'constants'

const captchapng = require('captchapng')

export default class AccountController extends Controller {
  async info(): Promise<void> {
    const { ctx, config } = this
    if (ctx.state.user) {
      ctx.status = 200
      ctx.body = ctx.state.user
      return
    }
    const userInfo = ctx.cookies.get('userInfo', { encrypt: true, signed: true })
    if (!userInfo) {
      ctx.status = 200
      ctx.body = {}
      return
    }
    const rsaPwd = Buffer.from(userInfo.split('&&')[1], 'base64')
    const decrypted = crypto.privateDecrypt({ key: config.rsaPrivateKey, padding: constants.RSA_PKCS1_PADDING }, rsaPwd)
    const md5Pwd = decrypted.toString('utf8') // 解密完成
    const user = await getRepository(User)
      .createQueryBuilder('user')
      // .addSelect("user.password")
      .where('user.account=:account', { account: userInfo.split('&&')[0] })
      .andWhere('user.password=:password', { password: md5Pwd })
      .getOne()
    if (!user) {
      ctx.status = 401
      ctx.body = { message: '用户未登录!', needRedirect: false }
      return
    }
    ctx.status = 200
    ctx.body = user
    return ctx.login(user)
  }

  async login(): Promise<void> {
    const { ctx } = this
    const { account, password, autoLogin } = ctx.request.body
    if (!account && !password) {
      ctx.response.redirect('/api/account/info')
      return
    }
    return (ctx.app as any).passport.authenticate('local', (err, user, info) => {
      if (!user || err) {
        ctx.status = 400
        ctx.body = info
        return
      }
      if (autoLogin) {
        ctx.cookies.set('userInfo', `${account}&&${password}`, { encrypt: true, signed: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
      }
      ctx.status = 200
      ctx.body = user
      return ctx.login(user)
    })(ctx)
  }

  async register(): Promise<void> {
    const { ctx } = this
    const { mail: account, password } = ctx.request.body
    const existentUser = await getRepository(User).createQueryBuilder('user').where('user.account=:account', { account }).getOne()
    if (existentUser) {
      ctx.status = 400
      ctx.body = { message: '该用户已存在', flag: false }
      return
    }
    const user = await getRepository(User).create({
      account,
      password,
      nickName: account,
    })
    await getRepository(User).save(user)
    ctx.status = 200
    ctx.body = { message: '注册成功', flag: true }
  }

  async logout() {
    const { ctx } = this
    ctx.cookies.set('userInfo', null)
    ctx.logout()
    ctx.status = 200
    ctx.body = { message: '退出成功', flag: true }
  }

  async getPublicKey() {
    const { ctx, config } = this
    ctx.body = { item: config.rsaPublicKey }
  }

  async getCaptcha() {
    const { ctx } = this
    const cap: number = Math.floor(Math.random() * 9000 + 1000)
    const p = new captchapng(80, 30, cap)
    p.color(0, 0, 0, 0)
    p.color(80, 80, 80, 255)
    const base64 = p.getBase64()
    if (!base64) {
      ctx.status = 400
      ctx.body = { message: '获取验证码失败', flag: false }
    } else {
      ctx.session.cap = cap
      ctx.status = 200
      ctx.body = { item: base64 }
    }
  }

  async verifyCaptcha() {
    const { ctx } = this
    const { captcha } = ctx.request.body
    const { cap } = ctx.session
    if (captcha === `${cap}`) {
      ctx.status = 200
      ctx.body = { message: '验证成功', flag: true }
    } else {
      ctx.status = 400
      ctx.body = { message: '验证码错误', flag: false }
    }
  }
}
