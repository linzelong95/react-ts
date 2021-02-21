import type { Context, Application } from 'egg'

module.exports = (options, app: Application) => async (ctx: Context, next) => {
  const { isApi } = options || {}
  const { path, logger } = ctx

  try {
    await next()

    if (ctx.status === 404 && !ctx.body) {
      if (isApi?.test(path)) {
        ctx.body = { code: 404, message: 'Api not found!' }
        return
      }
      ctx.render('error.ejs', {
        ...app.config.locals,
        code: 404,
        message: '页面未找到',
        title: '页面未找到',
      })
      return
    }

    const isApplicationJson = /application\/json/.test((ctx.response?.header?.['content-type'] as string) || '')

    // 若有需要，在这里统一处理code和message
    if (ctx.body && isApi?.test(path) && isApplicationJson) {
      const { code, message, data } = ctx.body
      // ctx.status = code === 0 ? 200 : code // 默认响应200，不需要重新设置
      ctx.body = { code, message, data }
    }
  } catch (err) {
    // ctx.throw(400, 'name required',{title:'xxx});
    // 等效于:
    // const err = new Error('name required');
    // err.status = 400;
    // err.expose = true;
    // err.title = 'xxx';
    // throw err;

    // http-errors deprecated non-error status code; use only 4xx or 5xx status codes node_modules/koa/lib/context.js:97:11
    // ctx.throw只接受4xx和5xx，否则会触发异常（服务端内部错误500）

    // 代码错误，如访问ctx.a.b(ctx不存在a变量)时，status为undefined，需要赋默认值
    const { status = 500, message = '未知错误', title, stack } = err as { status: number; message?: string; stack: string; title?: string }

    ctx.status = status

    if (status === 500) {
      app.messenger.sendToAgent('send-alarm', { title: 'Node 运行时错误', seqId: ctx.seqId, error: { message, stack } })
    }

    // 打印错误日志
    if (status !== 404) logger.error(err)

    // 如果是 API，返回 JSON 格式数据
    if (isApi?.test(path)) {
      ctx.body = { code: status, message }
      return
    }

    return ctx.render('error.ejs', {
      ...app.config.locals,
      code: status,
      message,
      title: title || message,
    })
  }
}
