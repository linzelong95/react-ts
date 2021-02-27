import { Controller } from 'egg'
import { StatusCode } from '@constant/status'

export default class AdminTagController extends Controller {
  async list(): Promise<void> {
    const { ctx } = this
    const {
      conditionQuery: { isEnable, name = '', orderBy = {}, sortIdsArr = [] },
      index = 1,
      size = 10,
    } = ctx.request.body
    const [list, total] = await this.service.adminService.tag.list({ isEnable, name, orderBy, index, size, sortIdsArr })
    ctx.body = { code: 0, data: { list, total } }
  }

  async save(): Promise<void> {
    const { ctx } = this
    const { id, name, isEnable, sortId } = ctx.request.body
    const flag = await this.service.adminService.tag.save({ id, name, isEnable, sort: { id: sortId } })
    const action = id ? '更新' : '添加'
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, `${action}失败`)
    ctx.body = { code: 0, message: `${action}成功` }
  }

  async delete(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const ids = items.map((i) => i.id)
    const flag = await this.service.adminService.tag.delete(ids)
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '删除失败')
    ctx.body = { code: 0, message: '删除成功' }
  }

  async lock(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const ids = items.map((i) => i.id)
    const flag = await this.service.adminService.tag.lock(ids)
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '禁用失败')
    ctx.body = { code: 0, message: '禁用成功' }
  }

  async unlock(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const ids = items.map((i) => i.id)
    const flag = await this.service.adminService.tag.unlock(ids)
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '启用失败')
    ctx.body = { code: 0, message: '启用成功' }
  }
}
