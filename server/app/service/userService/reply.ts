import { Service } from 'egg'
import { getRepository } from 'typeorm'
import { Reply } from '@entity/Reply'

export default class UserReplyService extends Service {
  repository = getRepository(Reply)

  async list(options) {
    const { reply, orderBy, index, size, articleIdsArr, isTop, isApproved } = options
    const orderByMap: Record<string, 'ASC' | 'DESC'> = { 'reply.isTop': 'DESC' }
    if (orderBy.name && ['isApproved', 'isTop', 'createDate', 'updateDate'].includes(orderBy.name))
      orderByMap[`reply.${orderBy.name}`] = orderBy.by
    if (!orderBy.name || !['createDate', 'updateDate'].includes(orderBy.name)) orderByMap['reply.createDate'] = 'ASC'
    return await this.repository
      .createQueryBuilder('reply')
      .leftJoinAndSelect('reply.from', 'fromUser')
      .leftJoinAndSelect('reply.to', 'toUser')
      .where('reply.reply like :reply', { reply: `%${reply}%` })
      .andWhere(articleIdsArr.length ? `reply.article in (${articleIdsArr.join(',')})` : '1=1')
      .andWhere(isApproved !== undefined ? `reply.isApproved=${isApproved}` : '1=1')
      .andWhere(isTop !== undefined ? `reply.isTop=${isTop}` : '1=1')
      .orderBy(orderByMap)
      .skip((index - 1) * size)
      .take(size)
      .getManyAndCount()
  }

  async save(options) {
    let flag = true
    const replyEntity = this.repository.create({ ...options })
    await this.repository.save(replyEntity).catch(() => {
      flag = false
    })
    return flag
  }

  async delete(options) {
    const { idsArr, parentIdsArr } = options
    const result = await this.repository
      .createQueryBuilder()
      .delete()
      .from(Reply)
      .where(`id in (${idsArr.join(',')}) ${parentIdsArr.length > 0 ? `or parentId in (${parentIdsArr.join(',')})` : ''}`)
      .execute()
    return Boolean(result.raw.affectedRows)
  }
}
