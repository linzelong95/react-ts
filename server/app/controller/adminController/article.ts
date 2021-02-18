import { Controller } from 'egg'

export default class AdminArticleController extends Controller {
  async list(): Promise<void> {
    const { ctx } = this
    const user = ctx.state.user
    const {
      conditionQuery: { title = '', orderBy = {}, category = {}, tagIdsArr = [], articleId },
      index = 1,
      size = 10,
    } = ctx.request.body
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
    ctx.body = { list, total }
  }

  async content() {
    const { ctx } = this
    const { articleId } = ctx.request.body
    const content = await this.service.adminService.article.content({ articleId })
    ctx.body = { list: content }
  }

  async save(): Promise<void> {
    const { ctx } = this
    const user = ctx.state.user
    const { id, title, abstract, isTop, category, tags, content, imageUrl } = ctx.request.body
    const flag = await this.service.adminService.article.save({ id, title, abstract, isTop, category, user, tags, content, imageUrl })
    const action = id ? '更新' : '添加'
    if (!flag) {
      ctx.status = 400
      ctx.body = { message: `${action}失败`, flag }
      return
    }
    ctx.status = 200
    ctx.body = { message: `${action}成功`, flag }
  }

  async delete(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const ids = items.map((i) => i.id)
    const flag = await this.service.adminService.article.delete(ids)
    if (!flag) {
      ctx.status = 400
      ctx.body = { message: `删除失败`, flag }
      return
    }
    ctx.status = 200
    ctx.body = { message: `删除成功`, flag }
  }

  async lock(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const ids = items.map((i) => i.id)
    const flag = await this.service.adminService.article.lock(ids)
    if (!flag) {
      ctx.status = 400
      ctx.body = { message: `禁用失败`, flag }
      return
    }
    ctx.status = 200
    ctx.body = { message: `禁用成功`, flag }
  }

  async unlock(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const ids = items.map((i) => i.id)
    const flag = await this.service.adminService.article.unlock(ids)
    if (!flag) {
      ctx.status = 400
      ctx.body = { message: `启用失败`, flag }
      return
    }
    ctx.status = 200
    ctx.body = { message: `启用成功`, flag }
  }

  async top(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const ids = items.map((i) => i.id)
    const flag = await this.service.adminService.article.top(ids)
    if (!flag) {
      ctx.status = 400
      ctx.body = { message: `置顶失败`, flag }
      return
    }
    ctx.status = 200
    ctx.body = { message: `置顶成功`, flag }
  }

  async unTop(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const ids = items.map((i) => i.id)
    const flag = await this.service.adminService.article.unTop(ids)
    if (!flag) {
      ctx.status = 400
      ctx.body = { message: `取置失败`, flag }
      return
    }
    ctx.status = 200
    ctx.body = { message: `取置成功`, flag }
  }
}
