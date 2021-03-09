import { LogEvent } from '@constant/log'
import { v4 as uuid } from 'uuid'
import type { Context } from 'egg'

module.exports = (options) => async (ctx: Context, next) => {
  const { ignoredUrls, isNextApp } = options || {}

  const seqId = ctx.headers['x-seq-id'] || `blog-node-${uuid()}`
  ctx.seqId = seqId

  const { header, method, origin, href, path, query, params, ip, ips, request } = ctx
  // 暂时不记录nextjs资源的请求
  if (isNextApp.test(path)) return await next()

  ctx.logger.info({
    event: LogEvent.CLIENT_REQUEST,
    href,
    path,
    method,
    origin,
    query,
    params,
    ip,
    ips,
    header,
    body: request.body,
  })

  await next()

  // nextjs应用，忽略（理论上在这之前，中间件执行已被中间，所以可以不需要判断）
  if (isNextApp.test(path)) return

  // 返回头带上 seq id
  ctx.set('X-Seq-Id', seqId)

  const isApplicationJson = /application\/json/.test((ctx.response?.header?.['content-type'] as string) || '')

  // 响应体带上 seq id
  if (isApplicationJson && ctx.body) ctx.body.seqId = seqId

  // 不打印日志
  if (ignoredUrls.some((url) => url.test(path)) || !isApplicationJson) return

  const responseLoggerParams = {
    event: LogEvent.CLIENT_RESPONSE,
    status: ctx.status,
    message: ctx.message,
    type: ctx.type,
    href,
    path,
    body: ctx.response.body,
    header: ctx.response.header,
  }
  if (ctx.status >= 400) {
    ctx.logger.error(responseLoggerParams)
  } else {
    ctx.logger.info(responseLoggerParams)
  }
}
