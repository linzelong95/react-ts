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

  async detail(): Promise<void> {
    const { ctx } = this
    const { id } = ctx.query
    const [article, contentRes] = await this.service.userService.article.detail(id)
    if (!article?.id) ctx.throw(StatusCode.NOT_FOUND, '不存在')
    ctx.body = { code: 0, data: { ...article, content: ctx.helper.shtml(contentRes!.content) } }
  }
}
