import { EggLogger } from 'egg'

export default class Alarm {
  config: any

  logger: any

  constructor(config: Record<string, any>, logger: EggLogger) {
    this.config = config
    this.logger = logger
  }

  send(msg: string, title?: string): void {
    console.log(22, msg, title)
  }

  sendWorkWX(msg: string): void {
    console.log(22, msg)
  }
}
