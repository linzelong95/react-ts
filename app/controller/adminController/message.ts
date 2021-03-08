import { Controller } from 'egg'
import { StatusCode } from '@constant/status'
import { Message } from '@entity/Message'

export default class AdminMessageController extends Controller {
  async list(): Promise<void> {
    const { ctx } = this
    const { conditionQuery = {}, index = 1, size = 10 } = ctx.request.body
    const { message = '', orderBy = {}, isTop, isApproved, isRoot, prettyFormat } = conditionQuery
    const [list, total] = await this.service.adminService.message.list({ message, orderBy, index, size, isTop, isApproved, isRoot })
    let newList = [...list]
    if (prettyFormat) {
      const parentArr = [] as (Message & { children: Message[] })[]
      const sonArr = [] as (Message & { children?: Message[] })[]
      list.forEach((item) => {
        if (!item.parentId) {
          parentArr.push({ ...item, children: [] })
        } else {
          sonArr.push(item)
        }
      })
      newList = parentArr.map((parentItem) => {
        sonArr.forEach((sonItem) => {
          if (sonItem.parentId === parentItem.id) parentItem.children = [...parentItem.children, sonItem]
        })
        return parentItem
      })
    }
    ctx.body = { code: 0, data: { list: newList, total } }
  }

  async save(): Promise<void> {
    const { ctx } = this
    const {
      user: { id: userId },
    } = ctx.state
    const { id, message, blog = '', fromMail = '无', toMail = '无', parentId = 0, fromId = userId, toId, isApproved = 1 } = ctx.request.body
    const params: any = { id, message, parentId, isApproved, blog, fromMail, toMail }
    if (fromId) params.from = { id: fromId }
    if (toId) params.to = { id: toId }
    const flag = await this.service.adminService.message.save(params)
    const action = id ? '更新' : '添加'
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, `${action}失败`)
    ctx.body = { code: 0, message: `${action}成功` }
  }

  async delete(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const idsArr = items.map((item) => item.id)
    const parentIdsArr = items.reduce((parentIdsArr, item) => {
      if (!item.parentId) parentIdsArr.push(item.id)
      return parentIdsArr
    }, [])
    const flag = await this.service.adminService.message.delete({ idsArr, parentIdsArr })
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '操作失败')
    ctx.body = { code: 0, message: '操作成功' }
  }

  async approve(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const ids = items.map((item) => item.id)
    const flag = await this.service.adminService.message.approve(ids)
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '操作失败')
    ctx.body = { code: 0, message: '操作成功' }
  }

  async disapprove(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const ids = items.map((item) => item.id)
    const flag = await this.service.adminService.message.disapprove(ids)
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '操作失败')
    ctx.body = { code: 0, message: '操作成功' }
  }

  async top(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const ids = items.map((item) => item.id)
    const flag = await this.service.adminService.message.top(ids)
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '操作失败')
    ctx.body = { code: 0, message: '操作成功' }
  }

  async unTop(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const ids = items.map((item) => item.id)
    const flag = await this.service.adminService.message.unTop(ids)
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '操作失败')
    ctx.body = { code: 0, message: '操作成功' }
  }
}
