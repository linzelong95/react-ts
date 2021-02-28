import { Controller } from 'egg'
import { StatusCode } from '@constant/status'
import { Message } from '@entity/Message'

export default class UserMessageController extends Controller {
  async list(): Promise<void> {
    const { ctx } = this
    const { conditionQuery = {}, index = 1, size = 10 } = ctx.request.body
    const { message = '', orderBy = {}, isTop, isApproved, prettyFormat } = conditionQuery
    const [list, total] = await this.service.userService.message.list({ message, orderBy, index, size, isTop, isApproved })
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
    const { id, message, blog = '', fromMail = '无', toMail = '无', parentId = 0, fromId, toId, isApproved = 0 } = ctx.request.body
    const params: any = { id, message, parentId, isApproved, blog, fromMail, toMail }
    if (fromId) params.from = { id: fromId }
    if (toId) params.to = { id: toId }
    const flag = await this.service.userService.message.save(params)
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '操作失败')
    ctx.body = { code: 0, message: '操作成功' }
  }

  async delete(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const idsArr = items.map((item) => item.id)
    const parentIdsArr = items.reduce((parentIdsArr, item) => {
      if (!item.parentId) parentIdsArr.push(item.id)
      return parentIdsArr
    }, [])
    const flag = await this.service.userService.message.delete({ idsArr, parentIdsArr })
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '操作失败')
    ctx.body = { code: 0, message: '操作成功' }
  }
}
