import * as ip from 'ip'
import Alarm from '@lib/alarm'
import type { Agent } from 'egg'
const moment = require('moment')
const LruCache = require('lru-cache')

const lruCache = new LruCache({
  max: 3000,
  maxAge: 24 * 60 * 60 * 1000, // ms,缓存一天
})

function runInProd(env, cb) {
  if (env === 'prod') cb()
}

module.exports = (agent: Agent) => {
  const { config, logger } = agent

  const currentIp = ip.address()

  // 初始化告警
  const alarm = new Alarm(config.alarm, logger)

  // 启动完成发送告警
  agent.messenger.on('egg-ready', () => {
    runInProd(config.env, () => {
      alarm.sendWorkWX(
        'Node 进程启动成功\n' +
          `部署时间：${moment().format('YYYY-MM-DD HH:mm:ss')}\n` +
          `环境：${config.env}\n` +
          `IP：${currentIp}`,
      )
    })
  })

  // 支持接收来自 app 的消息
  agent.messenger.on('send-alarm', ({ title, message, error, seqId }) => {
    if (error) {
      const { message, stack } = error
      const realStack = stack.replace(message, '').split('\n').slice(1).join('\n')
      const hasCalled = lruCache.get(realStack)
      if (hasCalled) return
      lruCache.set(realStack, 1)
    }
    runInProd(config.env, () => {
      alarm.send(
        `Node 告警（${moment().format('YYYY-MM-DD HH:mm:ss')} / ${
          config.env
        } / ${currentIp} / ${seqId}）\n${message || error.stack}`,
        title,
      )
    })
  })
}
