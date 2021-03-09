import { Controller } from 'egg'
import { StatusCode } from '@constant/status'

export default class UserArticleController extends Controller {
  async list(): Promise<void> {
    const { ctx } = this
    const { conditionQuery = {}, index = 1, size = 10 } = ctx.request.body
    const { title = '', orderBy = {}, category = {}, tagIdsArr = [], articleId } = conditionQuery
    const [list, total] = await this.service.userService.article.list({ articleId, title, orderBy, index, size, category, tagIdsArr })
    ctx.body = { code: 0, data: { list, total } }
  }

  async content(): Promise<void> {
    const { ctx } = this
    const { articleId } = ctx.request.body
    const res = await this.service.userService.article.content({ articleId })
    if (!res?.content) ctx.throw(StatusCode.NOT_FOUND, '不存在')
    ctx.body = { code: 0, data: ctx.helper.shtml(res!.content) }
  }
}
