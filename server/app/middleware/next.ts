import type { Context, Application } from 'egg'

module.exports = (options, app: Application) => async (ctx: Context, next) => {
  const { isNextApp } = options || {}
  const { path, method, state } = ctx
  const isGetMethod = method.toLowerCase() === 'get'
  if (isNextApp.test(path) && isGetMethod) {
    ctx.status = 200
    if (/\.js$/.test(path)) {
      ctx.set('Content-Type', 'application/javascript')
    }
    if (/\.css$/.test(path)) {
      ctx.set('Content-Type', 'text/css')
    }
    // 将登录信息注入到ctx.req，供next.js应用读取
    ;(ctx.req as any).userInfo = state?.user
    const nextHandle = (app as any).nextServer.getRequestHandler()
    await nextHandle(ctx.req, ctx.res)
    return
  }
  await next()
}
