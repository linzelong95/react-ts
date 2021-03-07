import type { Context, Application } from 'egg'

async function nextRender(nextHandle, ctx) {
  const { path, state } = ctx
  ctx.status = 200
  if (/\.js$/.test(path)) {
    ctx.set('Content-Type', 'application/javascript')
  }
  if (/\.css$/.test(path)) {
    ctx.set('Content-Type', 'text/css')
  }
  // 将登录信息注入到ctx.req，供next.js应用读取
  ctx.req.userInfo = state?.user
  await nextHandle(ctx.req, ctx.res)
}

module.exports = (options, app: Application) => async (ctx: Context, next) => {
  const { isNextAppAsset } = options || {}
  const { path, method } = ctx
  const nextHandle = (app as any).nextServer.getRequestHandler()
  if (isNextAppAsset.test(path) && method.toLowerCase() === 'get') {
    await nextRender(nextHandle, ctx)
    return
  }
  await next()
  if (ctx.status === 404 && method.toLowerCase() === 'get') {
    await nextRender(nextHandle, ctx)
  }
}
