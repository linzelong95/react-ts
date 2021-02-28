import { Controller } from 'egg'
import { StatusCode } from '@constant/status'
import { Reply } from '@entity/Reply'

export default class AdminReplyController extends Controller {
  async list(): Promise<void> {
    const { ctx } = this
    const { conditionQuery = {}, index = 1, size = 10 } = ctx.request.body
    const { reply = '', orderBy = {}, category = {}, articleIdsArr = [], isTop, isApproved, isRoot, prettyFormat } = conditionQuery
    const [list, total] = await this.service.adminService.reply.list({
      reply,
      orderBy,
      index,
      size,
      category,
      articleIdsArr,
      isTop,
      isApproved,
      isRoot,
    })
    let newList = [...list]
    if (prettyFormat) {
      const parentArr: (Reply & { children: Reply[] })[] = []
      const sonArr: (Reply & { children?: Reply[] })[] = []
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
    const { id, reply, parentId = 0, fromId = userId, toId = userId, articleId, isApproved = 1 } = ctx.request.body
    const flag = await this.service.adminService.reply.save({
      id,
      reply,
      parentId,
      from: { id: fromId },
      to: { id: toId },
      isApproved,
      article: { id: articleId },
    })
    const action = id ? '更新' : '添加'
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, `${action}失败`)
    ctx.body = { code: 0, message: `${action}成功` }
  }

  async delete(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const idsArr = items.map((item) => item.id)
    const parentIdsArr: number[] = []
    items.forEach((item) => {
      if (item.parentId === 0) parentIdsArr.push(item.id)
    })
    const flag = await this.service.adminService.reply.delete({ idsArr, parentIdsArr })
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '操作失败')
    ctx.body = { code: 0, message: '操作成功' }
  }

  async approve(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const ids = items.map((item) => item.id)
    const flag = await this.service.adminService.reply.approve(ids)
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '操作失败')
    ctx.body = { code: 0, message: '操作成功' }
  }

  async disapprove(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const ids = items.map((item) => item.id)
    const flag = await this.service.adminService.reply.disapprove(ids)
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '操作失败')
    ctx.body = { code: 0, message: '操作成功' }
  }

  async top(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const ids = items.map((item) => item.id)
    const flag = await this.service.adminService.reply.top(ids)
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '操作失败')
    ctx.body = { code: 0, message: '操作成功' }
  }

  async unTop(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const ids = items.map((item) => item.id)
    const flag = await this.service.adminService.reply.unTop(ids)
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '操作失败')
    ctx.body = { code: 0, message: '操作成功' }
  }
}
