import { Controller } from 'egg'
import { StatusCode } from '@constant/status'

export default class UserArticleController extends Controller {
  async list(): Promise<void> {
    const { ctx } = this
    const { id, orderName, orderBy = 'ASC', page = 1, size = 10, search = '', categoryIds, tagIds } = ctx.query
    const [list, total] = await this.service.userService.article.list({
      id,
      title: search,
      orderBy: orderName ? { name: orderName, by: orderBy } : {},
      page,
      size,
      tagIdsArr: tagIds ? tagIds.split(',') : [],
      sortIdsArr: [],
      cateIdsArr: categoryIds ? categoryIds.split(',') : [],
    })
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
