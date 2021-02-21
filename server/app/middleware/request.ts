import { LogEvent } from '@constant/log'
import { v4 as uuid } from 'uuid'
import type { Context } from 'egg'

module.exports = (options) => async (ctx: Context, next) => {
  const { ignoredUrls } = options || {}

  const seqId = ctx.headers['x-seq-id'] || `blog-node-${uuid()}`
  ctx.seqId = seqId

  const { header, method, origin, href, path, query, params, ip, ips, request } = ctx
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

  // 返回头带上 seq id
  ctx.set('X-Seq-Id', seqId)

  const isApplicationJson = /application\/json/.test((ctx.response?.header?.['content-type'] as string) || '')

  if (isApplicationJson) ctx.body.seqId = seqId

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
