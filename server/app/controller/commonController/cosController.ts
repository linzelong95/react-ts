import { Controller } from 'egg'
import { getAuthorization } from '@lib/cosAuth'

export default class CosController extends Controller {
  auth() {
    const { ctx, config } = this
    const { body } = ctx.request
    const { secretId, secretKey } = config.cos || {}
    let data
    const expiredSecond = 24 * 60 * 60 // 一天
    if (body.batch) {
      data = []
      body.batch.forEach((item) => {
        const { method, pathname } = item
        const auth = getAuthorization(secretId, secretKey, { method, pathname, expiredSecond })
        data.push({ method, pathname, auth })
      })
    } else {
      const { method, pathname } = body
      const auth = getAuthorization(secretId, secretKey, { method, pathname, expiredSecond })
      data = { method, pathname, auth }
    }

    this.ctx.body = { code: 0, data }
  }
}
