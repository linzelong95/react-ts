import { Controller } from 'egg'
import { getRepository } from 'typeorm'
import { User } from '@entity/User'
import { StatusCode } from '@constant/status'
import * as crypto from 'crypto'
import * as constants from 'constants'
const CaptchaPng = require('captchapng')

export default class AccountController extends Controller {
  async info(): Promise<void> {
    const { ctx, config } = this
    if (ctx.state.user) {
      ctx.body = { code: 0, data: ctx.state.user }
      return
    }
    const userInfo = ctx.cookies.get('userInfo', { encrypt: true, signed: true })
    if (!userInfo) {
      ctx.body = { code: 0, data: {} }
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
    if (!user) ctx.throw(401, '用户未登录!')
    ctx.login(user)
    ctx.body = { code: 0, data: { ...user, password: undefined } }
  }

  async login(): Promise<void> {
    const { ctx } = this
    const { account, password, autoLogin } = ctx.request.body
    if (!account && !password) {
      ctx.response.redirect('/api/account/info')
      return
    }
    return (ctx.app as any).passport.authenticate('local', (err, user, info: { message: string }) => {
      if (!user || err) ctx.throw(StatusCode.BAD_REQ, info.message)
      if (autoLogin) {
        const maxAge = 7 * 24 * 60 * 60 * 1000
        ctx.cookies.set('userInfo', `${account}&&${password}`, { encrypt: true, signed: true, maxAge })
      }
      ctx.login(user)
      ctx.body = { code: 0, message: '登录成功', data: user }
    })(ctx)
  }

  async register(): Promise<void> {
    const { ctx } = this
    const { account, password } = ctx.request.body
    const hasExistedOne = await getRepository(User).createQueryBuilder('user').where('user.account=:account', { account }).getOne()
    if (hasExistedOne) ctx.throw(StatusCode.FORBIDDEN, '该用户已存在')
    const user = await getRepository(User).create({
      account,
      password,
      nickName: account,
    })
    await getRepository(User).save(user)
    ctx.body = { code: 0, message: '注册成功' }
  }

  async logout() {
    const { ctx } = this
    ctx.cookies.set('userInfo', null)
    ctx.logout()
    ctx.body = { code: 0, message: '退出成功' }
  }

  async getPublicKey() {
    const { ctx, config } = this
    ctx.body = { code: 0, data: { item: config.rsaPublicKey } }
  }

  async getCaptcha() {
    const { ctx } = this
    const captchaNum: number = Math.floor(Math.random() * 9000 + 1000)
    const captchaPng = new CaptchaPng(80, 30, captchaNum)
    captchaPng.color(0, 0, 0, 0)
    captchaPng.color(80, 80, 80, 255)
    const base64 = captchaPng.getBase64()
    if (!base64) ctx.throw(StatusCode.SERVER_ERROR, '获取验证码失败')
    ctx.session.captchaNum = captchaNum
    ctx.body = { code: 0, data: { item: base64 } }
  }

  async verifyCaptcha() {
    const { ctx } = this
    const { captcha } = ctx.request.body
    const { captchaNum } = ctx.session
    if (captcha === `${captchaNum}`) {
      ctx.body = { code: 0, message: '验证成功' }
    } else {
      ctx.throw(StatusCode.BAD_REQ, '验证码错误')
    }
  }
}
