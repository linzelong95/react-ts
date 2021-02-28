import { Controller } from 'egg'

export default class UserArticleController extends Controller {
  async list(): Promise<void> {
    const { ctx } = this
    const {
      conditionQuery: { title = '', orderBy = {}, category = {}, tagIdsArr = [], articleId },
      index = 1,
      size = 10,
    } = ctx.request.body
    const [list, total] = await this.service.userService.article.list({ articleId, title, orderBy, index, size, category, tagIdsArr })
    ctx.body = { code: 0, data: { list, total } }
  }

  async content() {
    const { ctx } = this
    const { articleId } = ctx.request.body
    const content = await this.service.userService.article.content({ articleId })
    ctx.body = { code: 0, data: { list: content } }
  }
}
