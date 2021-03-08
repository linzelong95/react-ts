import { Controller } from 'egg'
import * as fs from 'fs'
const awaitWriteStream = require('await-stream-ready').write
const sendToWormhole = require('stream-wormhole')

export default class UploadController extends Controller {
  async upload(): Promise<void> {
    const { ctx } = this
    const stream = await ctx.getFileStream()
    const filename = `${Date.now()}${stream.filename}`
    const target = `${ctx.app.baseDir}/app/public/img/article/${filename}`
    const writeStream = fs.createWriteStream(target)
    try {
      await awaitWriteStream(stream.pipe(writeStream))
    } finally {
      await sendToWormhole(stream)
    }
    ctx.body = { url: `/public/img/article/${filename}` }
  }
}
