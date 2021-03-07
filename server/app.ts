import 'reflect-metadata'
import { createConnection } from 'typeorm'
import type { Application } from 'egg'

export default class AppBootHook {
  app: Application & { nextServer: any }

  constructor(app) {
    this.app = app
  }

  async didReady() {
    const { config, nextServer } = this.app
    await createConnection({
      type: 'mysql',
      ...config.mysql,
      synchronize: true,
      logging: false,
      entities: [`${__dirname}/app/entity/**/*{.ts,.js}`],
      migrations: [`${__dirname}/app/migration/**/*{.ts,.js}`],
      subscribers: [`${__dirname}/app/subscriber/**/*{.ts,.js}`],
    })
    await nextServer.prepare()
  }
}
