import { Service } from 'egg'
import { getRepository } from 'typeorm'
import { Tag } from '@entity/Tag'

export default class AdminTagService extends Service {
  repository = getRepository(Tag)

  async list(options) {
    const { index, size, name, isEnable, orderBy, sortIdsArr } = options
    const orderByMap: Record<string, 'ASC' | 'DESC'> = {}
    if (orderBy.name && ['name', 'isEnable', 'sort', 'createDate', 'updateDate'].includes(orderBy.name))
      orderByMap[`tag.${orderBy.name}`] = orderBy.by
    if (!orderBy.name || !['createDate', 'updateDate'].includes(orderBy.name)) orderByMap['tag.createDate'] = 'ASC'
    return await this.repository
      .createQueryBuilder('tag')
      .innerJoinAndSelect('tag.sort', 'sort', sortIdsArr?.length ? `sort.id in (${sortIdsArr.join(',')})` : '1=1')
      .where('tag.name like :name', { name: `%${name}%` })
      .andWhere(isEnable !== undefined ? `tag.isEnable=${isEnable}` : '1=1')
      .orderBy(orderByMap)
      .skip((index - 1) * size)
      .take(size)
      .getManyAndCount()
  }

  async save(options) {
    let flag = true
    const tagEntity = this.repository.create({ ...options })
    await this.repository.save(tagEntity).catch(() => {
      flag = false
    })
    return flag
  }

  async delete(ids: number[]) {
    const result = await this.repository.delete(ids)
    return Boolean(result.raw.affectedRows)
  }

  async lock(ids: number[]) {
    const result = await this.repository.createQueryBuilder().update(Tag).set({ isEnable: 0 }).where('id in (:...ids)', { ids }).execute()
    return Boolean(result.raw.affectedRows)
  }

  async unlock(ids: number[]) {
    const result = await this.repository.createQueryBuilder().update(Tag).set({ isEnable: 1 }).where('id in (:...ids)', { ids }).execute()
    return Boolean(result.raw.affectedRows)
  }
}
