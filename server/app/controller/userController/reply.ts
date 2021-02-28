import { Controller } from 'egg'
import { StatusCode } from '@constant/status'
import { Reply } from '@entity/Reply'

export default class UserReplyController extends Controller {
  async list(): Promise<void> {
    const { ctx } = this
    const { conditionQuery = {}, index = 1, size = 10 } = ctx.request.body
    const { reply = '', orderBy = {}, category = {}, articleIdsArr = [], isTop, isApproved, isRoot, prettyFormat } = conditionQuery
    const [list, total] = await this.service.userService.reply.list({
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
    const { id, reply, parentId = 0, fromId, toId, articleId, isApproved = 0 } = ctx.request.body
    const flag = await this.service.userService.reply.save({
      id,
      reply,
      parentId,
      from: { id: fromId },
      to: { id: toId },
      isApproved,
      article: { id: articleId },
    })
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '操作失败')
    ctx.body = { code: 0, message: '操作成功' }
  }

  async delete(): Promise<void> {
    const { ctx } = this
    const { items } = ctx.request.body
    const idsArr = items.map((i) => i.id)
    const parentIdsArr = items.reduce((parentIdsArr, item) => {
      if (!item.parentId) parentIdsArr.push(item.id)
      return parentIdsArr
    }, [])
    const flag = await this.service.userService.reply.delete({ idsArr, parentIdsArr })
    if (!flag) ctx.throw(StatusCode.SERVER_ERROR, '操作失败')
    ctx.body = { code: 0, message: '操作成功' }
  }
}
