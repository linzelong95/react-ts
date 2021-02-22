import { Controller } from 'egg'
import { StatusCode } from '@constant/status'

export default class AdminSortController extends Controller {
  async list(ctx): Promise<void> {
    const { conditionQuery = {}, index = 1, size = 10 } = ctx.request.body
    const { isEnable, isCateEnable, name = '', orderBy: orderBy = {} } = conditionQuery
    const [list, total] = await this.service.adminService.sort.list({ isEnable, isCateEnable, name, orderBy, index, size })
    ctx.body = { code: 0, data: { list, total } }
  }

  async save(ctx): Promise<void> {
    const { id, name, isEnable } = ctx.request.body
    const flag = await this.service.adminService.sort.save({ id, name, isEnable })
    const action = id ? '更新' : '添加'
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, `${action}失败`)
    ctx.body = { code: 0, message: `${action}成功` }
  }

  async delete(ctx): Promise<void> {
    const { items } = ctx.request.body
    const ids = items.map((i) => i.id)
    const flag = await this.service.adminService.sort.delete(ids)
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '删除失败')
    ctx.body = { code: 0, message: '删除成功' }
  }

  async lock(ctx): Promise<void> {
    const { items } = ctx.request.body
    const ids = items.map((i) => i.id)
    const flag = await this.service.adminService.sort.lock(ids)
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '禁用失败')
    ctx.body = { code: 0, message: '禁用成功' }
  }

  async unlock(ctx): Promise<void> {
    const { items } = ctx.request.body
    const ids = items.map((i) => i.id)
    const flag = await this.service.adminService.sort.unlock(ids)
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '启用失败')
    ctx.body = { code: 0, message: '启用成功' }
  }
}
