import { Service } from 'egg'
import { getRepository } from 'typeorm'
import { Sort } from '../../entity/Sort'

export default class UserSortService extends Service {
  repository = getRepository(Sort)

  async list(options) {
    const { index, size, name, isEnable, orderBy } = options
    const orderByMap: Record<string, 'ASC' | 'DESC'> = {}
    if (orderBy.name && ['name', 'isEnable', 'createDate', 'updateDate'].includes(orderBy.name))
      orderByMap[`sort.${orderBy.name}`] = orderBy.by
    if (!orderBy.name || !['createDate', 'updateDate'].includes(orderBy.name)) orderByMap['sort.createDate'] = 'ASC'
    return await this.repository
      .createQueryBuilder('sort')
      .leftJoinAndSelect('sort.categories', 'categories')
      .where('sort.name like :name', { name: `%${name}%` })
      .andWhere(isEnable !== undefined ? `sort.isEnable=${isEnable}` : '1=1')
      .orderBy(orderByMap)
      .skip((index - 1) * size)
      .take(size)
      .getManyAndCount()
  }
}
