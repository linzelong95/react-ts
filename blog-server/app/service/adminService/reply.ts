import { Service } from 'egg'
import { getRepository } from 'typeorm'
import { Reply } from '@entity/Reply'

export default class AdminReplyService extends Service {
  repository = getRepository(Reply)

  async list(options) {
    const {
      reply,
      orderBy,
      index,
      size,
      articleIdsArr,
      isTop,
      isApproved,
      isRoot,
      category: { sortIdsArr = [], cateIdsArr = [] },
    } = options
    const orderByMap: Record<string, 'ASC' | 'DESC'> = {}
    if (orderBy.name && ['isApproved', 'isTop', 'createDate', 'updateDate'].includes(orderBy.name))
      orderByMap[`reply.${orderBy.name}`] = orderBy.by
    if (!orderBy.name || !['isTop'].includes(orderBy.name)) orderByMap['reply.isTop'] = 'DESC'
    if (!orderBy.name || !['createDate', 'updateDate'].includes(orderBy.name)) orderByMap['reply.createDate'] = 'ASC'
    return await this.repository
      .createQueryBuilder('reply')
      .innerJoinAndSelect('reply.article', 'article')
      .innerJoin('article.category', 'category')
      .innerJoin('category.sort', 'sort')
      .leftJoinAndSelect('reply.from', 'fromUser')
      .leftJoinAndSelect('reply.to', 'toUser')
      .where('reply.reply like :reply', { reply: `%${reply}%` })
      .andWhere(articleIdsArr.length ? `reply.article in (${articleIdsArr.join(',')})` : '1=1')
      .andWhere(isApproved !== undefined ? `reply.isApproved=${isApproved}` : '1=1')
      .andWhere(isTop !== undefined ? `reply.isTop=${isTop}` : '1=1')
      .andWhere(isRoot !== undefined ? (isRoot === 0 ? 'reply.parentId>0' : 'reply.parentId=0') : '1=1')
      .andWhere(sortIdsArr.length && !cateIdsArr.length ? `sort.id in (${sortIdsArr.join(',')})` : '1=1')
      .andWhere(!sortIdsArr.length && cateIdsArr.length ? `category.id in (${cateIdsArr.join(',')})` : '1=1')
      .andWhere(
        sortIdsArr.length && cateIdsArr.length ? `sort.id in (${sortIdsArr.join(',')}) or category.id in (${cateIdsArr.join(',')})` : '1=1',
      )
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
    let flag = true
    const result = await this.repository
      .createQueryBuilder()
      .delete()
      .from(Reply)
      .where(`id in (${idsArr.join(',')}) ${parentIdsArr.length > 0 ? `or parentId in (${parentIdsArr.join(',')})` : ''}`)
      .execute()
    if (!result.raw.affectedRows) {
      flag = false
    }
    return flag
  }

  async approve(ids: number[]) {
    let flag = true
    const result = await this.repository
      .createQueryBuilder()
      .update(Reply)
      .set({ isApproved: 1 })
      .where('id in (:...ids)', { ids })
      .execute()
    if (!result.raw.affectedRows) {
      flag = false
    }
    return flag
  }

  async disapprove(ids: number[]) {
    let flag = true
    const result = await this.repository
      .createQueryBuilder()
      .update(Reply)
      .set({ isApproved: 0 })
      .where('id in (:...ids)', { ids })
      .execute()
    if (!result.raw.affectedRows) {
      flag = false
    }
    return flag
  }

  async top(ids: number[]) {
    let flag = true
    const result = await this.repository.createQueryBuilder().update(Reply).set({ isTop: 1 }).where('id in (:...ids)', { ids }).execute()
    if (!result.raw.affectedRows) {
      flag = false
    }
    return flag
  }

  async untop(ids: number[]) {
    let flag = true
    const result = await this.repository.createQueryBuilder().update(Reply).set({ isTop: 0 }).where('id in (:...ids)', { ids }).execute()
    if (!result.raw.affectedRows) {
      flag = false
    }
    return flag
  }
}
