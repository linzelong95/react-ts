import { Controller } from 'egg'
import { StatusCode } from '@constant/status'

export default class AdminArticleController extends Controller {
  async list(): Promise<void> {
    const { ctx } = this
    const { user } = ctx.state
    const { conditionQuery = {}, index = 1, size = 10 } = ctx.request.body
    const { title = '', orderBy = {}, category = {}, tagIdsArr = [], articleId } = conditionQuery
    const [list, total] = await this.service.adminService.article.list({
      title,
      orderBy,
      index,
      size,
      category,
      tagIdsArr,
      user,
      articleId,
    })
    ctx.body = { code: 0, data: { list, total } }
  }

  async content(): Promise<void> {
    const { ctx } = this
    const { articleId } = ctx.request.body
    const res = await this.service.adminService.article.content({ articleId })
    if (!res?.content) ctx.throw(StatusCode.NOT_FOUND, '不存在')
    ctx.body = { code: 0, data: ctx.helper.shtml(res!.content) }
  }

  async save(): Promise<void> {
    const { ctx } = this
    const user = ctx.state.user
    const { id, title, abstract, isTop, category, tags, content, imageUrl } = ctx.request.body
    const flag = await this.service.adminService.article.save({ id, title, abstract, isTop, category, user, tags, content, imageUrl })
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '操作失败')
    ctx.body = { code: 0, message: '操作成功' }
  }

  async delete(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const ids = items.map((item) => item.id)
    const flag = await this.service.adminService.article.delete(ids)
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '操作失败')
    ctx.body = { code: 0, message: '操作成功' }
  }

  async lock(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const ids = items.map((item) => item.id)
    const flag = await this.service.adminService.article.lock(ids)
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '操作失败')
    ctx.body = { code: 0, message: '操作成功' }
  }

  async unlock(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const ids = items.map((item) => item.id)
    const flag = await this.service.adminService.article.unlock(ids)
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '操作失败')
    ctx.body = { code: 0, message: '操作成功' }
  }

  async top(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const ids = items.map((item) => item.id)
    const flag = await this.service.adminService.article.top(ids)
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '操作失败')
    ctx.body = { code: 0, message: '操作成功' }
  }

  async unTop(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const ids = items.map((item) => item.id)
    const flag = await this.service.adminService.article.unTop(ids)
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '操作失败')
    ctx.body = { code: 0, message: '操作成功' }
  }
}
