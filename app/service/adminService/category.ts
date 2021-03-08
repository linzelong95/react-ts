import { Service } from 'egg'
import { getRepository } from 'typeorm'
import { Category } from '@entity/Category'

export default class AdminCategoryService extends Service {
  repository = getRepository(Category)

  async list(options) {
    const { index, size, name, isEnable, orderBy, sortIdsArr, id } = options
    const orderByMap: Record<string, 'ASC' | 'DESC'> = {}
    if (orderBy.name && ['name', 'isEnable', 'sort', 'createDate', 'updateDate'].includes(orderBy.name))
      orderByMap[`category.${orderBy.name}`] = orderBy.by
    if (!orderBy.name || !['createDate', 'updateDate'].includes(orderBy.name)) orderByMap['category.createDate'] = 'ASC'
    return await this.repository
      .createQueryBuilder('category')
      .innerJoinAndSelect('category.sort', 'sort', sortIdsArr?.length ? `sort.id in (${sortIdsArr.join(',')})` : '1=1')
      .where('category.name like :name', { name: `%${name}%` })
      .andWhere(id ? `category.id=${id}` : '1=1')
      .andWhere(isEnable !== undefined ? `category.isEnable=${isEnable}` : '1=1')
      .orderBy(orderByMap)
      .skip((index - 1) * size)
      .take(size)
      .getManyAndCount()
  }

  async save(options) {
    let flag = true
    const categoryEntity = this.repository.create({ ...options })
    await this.repository.save(categoryEntity).catch(() => {
      flag = false
    })
    return flag
  }

  async delete(ids: number[]) {
    const result = await this.repository.delete(ids)
    return Boolean(result.raw.affectedRows)
  }

  async lock(ids: number[]) {
    const result = await this.repository
      .createQueryBuilder()
      .update(Category)
      .set({ isEnable: 0 })
      .where('id in (:...ids)', { ids })
      .execute()
    return Boolean(result.raw.affectedRows)
  }

  async unlock(ids: number[]) {
    const result = await this.repository
      .createQueryBuilder()
      .update(Category)
      .set({ isEnable: 1 })
      .where('id in (:...ids)', { ids })
      .execute()
    return Boolean(result.raw.affectedRows)
  }
}
