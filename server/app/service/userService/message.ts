import { Service } from 'egg'
import { getRepository } from 'typeorm'
import { Message } from '@entity/Message'

export default class UserMessageService extends Service {
  repository = getRepository(Message)

  async list(options) {
    const { message, orderBy, index, size, isTop, isApproved } = options
    const orderByMap: Record<string, 'ASC' | 'DESC'> = { 'message.isTop': 'DESC' }
    if (orderBy.name && ['isApproved', 'isTop', 'createDate', 'updateDate'].includes(orderBy.name))
      orderByMap[`message.${orderBy.name}`] = orderBy.by
    if (!orderBy.name || !['createDate', 'updateDate'].includes(orderBy.name)) orderByMap['message.createDate'] = 'ASC'
    return await this.repository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.from', 'fromUser')
      .leftJoinAndSelect('message.to', 'toUser')
      .where('message.message like :message', { message: `%${message}%` })
      .andWhere(isApproved !== undefined ? `message.isApproved=${isApproved}` : '1=1')
      .andWhere(isTop !== undefined ? `message.isTop=${isTop}` : '1=1')
      .orderBy(orderByMap)
      .skip((index - 1) * size)
      .take(size)
      .getManyAndCount()
  }

  async save(options) {
    let flag = true
    const replyEntity = this.repository.create({ ...options })
    await this.repository.save(replyEntity).catch((e) => {
      flag = false
    })
    return flag
  }

  async delete(options) {
    const { idsArr, parentIdsArr } = options
    const result = await this.repository
      .createQueryBuilder()
      .delete()
      .from(Message)
      .where(`id in (${idsArr.join(',')}) ${parentIdsArr.length > 0 ? `or parentId in (${parentIdsArr.join(',')})` : ''}`)
      .execute()
    return Boolean(result.raw.affectedRows)
  }
}
