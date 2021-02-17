import { Controller } from 'egg'

export default class AdminSortController extends Controller {
  async list(ctx): Promise<void> {
    const { conditionQuery = {}, index = 1, size = 10 } = ctx.request.body
    const { isEnable, isCateEnable, name = '', orderBy: orderBy = {} } = conditionQuery
    const [list, total] = await this.service.adminService.category.list({ isEnable, isCateEnable, name, orderBy, index, size })
    ctx.body = { list, total }
  }

  async save(ctx): Promise<void> {
    const { id, name, isEnable } = ctx.request.body
    const flag = await this.service.adminService.category.save({ id, name, isEnable })
    const action = id ? '更新' : '添加'
    if (!flag) {
      ctx.status = 400
      ctx.body = { message: `${action}失败`, flag }
      return
    }
    ctx.status = 200
    ctx.body = { message: `${action}成功`, flag }
  }

  async delete(ctx): Promise<void> {
    const { items } = ctx.request.body
    const ids = items.map((i) => i.id)
    const flag = await this.service.adminService.category.delete(ids)
    if (!flag) {
      ctx.status = 400
      ctx.body = { message: `删除失败`, flag }
      return
    }
    ctx.status = 200
    ctx.body = { message: `删除成功`, flag }
  }

  async lock(ctx): Promise<void> {
    const { items } = ctx.request.body
    const ids = items.map((i) => i.id)
    const flag = await this.service.adminService.category.lock(ids)
    if (!flag) {
      ctx.status = 400
      ctx.body = { message: `禁用失败`, flag }
      return
    }
    ctx.status = 200
    ctx.body = { message: `禁用成功`, flag }
  }

  async unlock(ctx): Promise<void> {
    const { items } = ctx.request.body
    const ids = items.map((i) => i.id)
    const flag = await this.service.adminService.category.unlock(ids)
    if (!flag) {
      ctx.status = 400
      ctx.body = { message: `启用失败`, flag }
      return
    }
    ctx.status = 200
    ctx.body = { message: `启用成功`, flag }
  }
}
