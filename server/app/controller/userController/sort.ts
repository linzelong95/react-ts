import { Controller } from 'egg'

export default class UserSortController extends Controller {
  async list(): Promise<void> {
    const { ctx } = this
    const { isEnable = 1, name = '', page = 1, size = 10, orderBy = {} } = ctx.query
    const [list, total] = await this.service.userService.sort.list({ isEnable, name, orderBy, page, size })
    ctx.body = { code: 0, data: { list, total } }
  }
}
