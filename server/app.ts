import 'reflect-metadata'
import { createConnection } from 'typeorm'
import type { Application } from 'egg'
import next from 'next'

export default class AppBootHook {
  public app: Application & { nextServer: ReturnType<typeof next> }

  constructor(app: Application) {
    this.app = app
  }

  async willReady(): Promise<void> {
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
