import { Service } from 'egg'
import { getRepository } from 'typeorm'
import { Tag } from '@entity/Tag'

export default class UserTagService extends Service {
  repository = getRepository(Tag)

  async list(options) {
    const { page, size, name, isEnable, orderBy, sortIdsArr } = options
    const orderByMap: Record<string, 'ASC' | 'DESC'> = {}
    if (orderBy.name && ['name', 'isEnable', 'sort', 'createDate', 'updateDate'].includes(orderBy.name))
      orderByMap[`tag.${orderBy.name}`] = orderBy.by
    if (!orderBy.name || !['createDate', 'updateDate'].includes(orderBy.name)) orderByMap['tag.createDate'] = 'ASC'
    return await this.repository
      .createQueryBuilder('tag')
      .innerJoinAndSelect('tag.sort', 'sort', sortIdsArr.length ? `sort.id in (${sortIdsArr.join(',')})` : '1=1')
      .where('tag.name like :name', { name: `%${name}%` })
      .andWhere(isEnable !== undefined ? `tag.isEnable=${isEnable}` : '1=1')
      .orderBy(orderByMap)
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount()
  }
}
