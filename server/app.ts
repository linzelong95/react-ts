import 'reflect-metadata'
import { createConnection } from 'typeorm'
import type { Application } from 'egg'

export default (app: Application) => {
  app.beforeStart(async () => {
    const { mysql } = app.config
    await createConnection({
      type: 'mysql',
      ...mysql,
      synchronize: true,
      logging: false,
      entities: [`${__dirname}/app/entity/**/*{.ts,.js}`],
      migrations: [`${__dirname}/app/migration/**/*{.ts,.js}`],
      subscribers: [`${__dirname}/app/subscriber/**/*{.ts,.js}`],
    })
  })
}
