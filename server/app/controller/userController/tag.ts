import { Controller } from 'egg'

export default class userTagController extends Controller {
  async list(): Promise<void> {
    const { ctx } = this
    const { isEnable = 1, name = '', orderName, orderBy, sortIds, page = 1, size = 10 } = ctx.query
    const [list, total] = await this.service.userService.tag.list({
      isEnable,
      name,
      orderBy: orderName ? { name: orderName, by: orderBy } : {},
      page,
      size,
      sortIdsArr: sortIds ? sortIds.split(',') : [],
    })
    ctx.body = { code: 0, data: { list, total } }
  }
}
