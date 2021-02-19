import type { Context, Application } from 'egg'

module.exports = (options, app: Application) => async (ctx: Context, next) => {
  const { isApi } = options || {}
  const { path, logger } = ctx

  try {
    await next()

    // 404 单独处理
    if (ctx.status === 404 && !ctx.body) {
      if (isApi?.test(path)) {
        ctx.body = { code: 404, message: 'Api not found!' }
        return
      }
      return ctx.render('error.ejs', {
        ...app.config.locals,
        code: 404,
        message: '页面未找到',
        title: '页面未找到',
      })
    }

    const isApplicationJson = /application\/json/.test((ctx.response?.header?.['content-type'] as string) || '')

    // 返回统一化处理
    if (ctx.body && isApi?.test(path) && isApplicationJson) {
      // 若有需要，在这里统一处理code和message
      const { code, message, data } = ctx.body
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
