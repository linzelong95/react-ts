import 'reflect-metadata'
import { createConnection } from 'typeorm'
import type { Application } from 'egg'
import next from 'next'

type App = Application & { nextServer: ReturnType<typeof next> }

export default class AppBootHook {
  app: App

  constructor(app: App) {
    this.app = app
  }

  async willReady(): Promise<void> {
    const { nextServer } = this.app
    nextServer.prepare()
  }

  async didReady(): Promise<void> {
    const { config } = this.app
    await createConnection({
      type: 'mysql',
      ...config.mysql,
      synchronize: true,
      logging: false,
      entities: [`${__dirname}/app/entity/**/*{.ts,.js}`],
      migrations: [`${__dirname}/app/migration/**/*{.ts,.js}`],
      subscribers: [`${__dirname}/app/subscriber/**/*{.ts,.js}`],
    })
  }
}
