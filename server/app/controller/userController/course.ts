import { Controller } from 'egg'

export default class UserCourseController extends Controller {
  async list(): Promise<void> {
    const { ctx } = this
    const { conditionQuery = {}, index = 1, size = 10 } = ctx.request.body
    const { title = '', orderBy = { name: 'createDate', by: 'DESC' }, category = {}, tagIdsArr = [], articleId } = conditionQuery
    const [list, total] = await this.service.user.articleService.list({ articleId, title, orderBy, index, size, category, tagIdsArr })
    ctx.body = { code: 0, data: { list, total } }
  }
}
