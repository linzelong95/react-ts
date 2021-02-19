import type { Context } from 'egg'

module.exports = {
  succeedRes(ctx: Context, data?: Record<string, any>, message?: string) {
    ctx.body = { code: 0, data, message }
  },
}
