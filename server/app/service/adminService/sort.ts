import { Service } from 'egg'
import { getRepository } from 'typeorm'
import { Sort } from '../../entity/Sort'

export default class AdminSortService extends Service {
  repository = getRepository(Sort)

  async list(options) {
    const { index, size, name, isEnable, isCateEnable, orderBy } = options
    const orderByMap: Record<string, 'ASC' | 'DESC'> = {}
    if (orderBy.name && ['name', 'isEnable', 'createDate', 'updateDate'].includes(orderBy.name))
      orderByMap[`sort.${orderBy.name}`] = orderBy.by
    if (!orderBy.name || !['createDate', 'updateDate'].includes(orderBy.name)) orderByMap['sort.createDate'] = 'ASC'
    return await this.repository
      .createQueryBuilder('sort')
      .leftJoinAndSelect('sort.categories', 'categories', isCateEnable !== undefined ? `categories.isEnable=${isCateEnable}` : '1=1')
      .where('sort.name like :name', { name: `%${name}%` })
      .andWhere(isEnable !== undefined ? `sort.isEnable=${isEnable}` : '1=1')
      .orderBy(orderByMap)
      .skip((index - 1) * size)
      .take(size)
      .getManyAndCount()
  }

  async save(options) {
    let flag = true
    const sortEntity = this.repository.create({ ...options })
    await this.repository.save(sortEntity).catch(() => {
      flag = false
    })
    return flag
  }

  async delete(ids: number[]) {
    const result = await this.repository.delete(ids)
    return Boolean(result.raw.affectedRows)
  }

  async lock(ids: number[]) {
    const result = await this.repository.createQueryBuilder().update(Sort).set({ isEnable: 0 }).where('id in (:...ids)', { ids }).execute()
    return Boolean(result.raw.affectedRows)
  }

  async unlock(ids: number[]) {
    const result = await this.repository.createQueryBuilder().update(Sort).set({ isEnable: 1 }).where('id in (:...ids)', { ids }).execute()
    return Boolean(result.raw.affectedRows)
  }
}
