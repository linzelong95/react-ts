export default class Alarm {
  config: any
  logger: any
  constructor(config, logger) {
    this.config = config
    this.logger = logger
  }
  send(msg, title?: string) {
    console.log(22, msg, title)
  }
  sendWorkWX(msg) {
    console.log(22, msg)
  }
}
