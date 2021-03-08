import { Controller } from 'egg'

export default class userTagController extends Controller {
  async list(): Promise<void> {
    const { ctx } = this
    const { conditionQuery = {}, index = 1, size = 10 } = ctx.request.body
    const { isEnable, name = '', orderBy = {}, sortIdsArr = [] } = conditionQuery
    const [list, total] = await this.service.userService.tag.list({ isEnable, name, orderBy, index, size, sortIdsArr })
    ctx.body = { code: 0, data: { list, total } }
  }
}
