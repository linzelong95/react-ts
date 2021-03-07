import { Controller } from 'egg'

export default class UserSortController extends Controller {
  async list(): Promise<void> {
    const { ctx } = this
    const { conditionQuery = {}, index = 1, size = 10 } = ctx.request.body
    const { isEnable, name = '', orderBy: orderBy = {} } = conditionQuery
    const [list, total] = await this.service.userService.sort.list({ isEnable, name, orderBy, index, size })
    ctx.body = { code: 0, data: { list, total } }
  }
}
