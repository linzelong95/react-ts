import { Controller } from 'egg'

export default class UserArticleController extends Controller {
  async list(): Promise<void> {
    const { ctx } = this
    const { id, page = 1, size = 10, search = '' } = ctx.query
    const [list, total] = await this.service.userService.user.list({
      id,
      search,
      page,
      size,
    })
    ctx.body = { code: 0, data: { list, total } }
  }
}
