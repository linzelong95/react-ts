import 'reflect-metadata'
import { createConnection } from 'typeorm'
import type { Application } from 'egg'

export default (app: Application) => {
  app.beforeStart(async () => {
    const { env } = app.config
    // const dir = env === 'prod' ? 'dist' : 'src'
    await createConnection({
      type: 'mysql',
      host: env === 'prod' ? '127.0.0.1' : '120.78.139.146',
      port: 3306,
      username: 'root',
      password: 'admin',
      database: 'myblog',
      synchronize: true,
      logging: false,
      entities: [`${__dirname}/app/entity/**/*{.ts,.js}`],
      migrations: [`${__dirname}/app/migration/**/*{.ts,.js}`],
      subscribers: [`${__dirname}/app/subscriber/**/*{.ts,.js}`],
    })
  })
}