import { Controller } from 'egg'
import { StatusCode } from '@constant/status'

export default class AdminCategoryController extends Controller {
  async list(): Promise<void> {
    const { ctx } = this
    const { conditionQuery = {}, index = 1, size = 10 } = ctx.request.body
    const { isEnable, name = '', orderBy = {}, sortIdsArr = [], id } = conditionQuery
    const [list, total] = await this.service.adminService.category.list({ isEnable, name, orderBy, index, size, sortIdsArr, id })
    ctx.body = { code: 0, data: { list, total } }
  }

  async save(): Promise<void> {
    const { ctx } = this
    const { id, name, isEnable, sortId } = ctx.request.body
    const flag = await this.service.adminService.category.save({ id, name, isEnable, sort: { id: sortId } })
    const action = id ? '更新' : '添加'
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, `${action}失败`)
    ctx.body = { code: 0, message: `${action}成功` }
  }

  async delete(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const ids = items.map((i) => i.id)
    const flag = await this.service.adminService.category.delete(ids)
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '删除失败')
    ctx.body = { code: 0, message: '删除成功' }
  }

  async lock(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const ids = items.map((i) => i.id)
    const flag = await this.service.adminService.category.lock(ids)
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '禁用失败')
    ctx.body = { code: 0, message: '禁用成功' }
  }

  async unlock(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const ids = items.map((i) => i.id)
    const flag = await this.service.adminService.category.unlock(ids)
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '启用失败')
    ctx.body = { code: 0, message: '启用成功' }
  }
}
