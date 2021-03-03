import { Service } from 'egg'
import { getRepository } from 'typeorm'
import { Article } from '@entity/Article'
import { Content } from '@entity/Content'

export default class AdminArticleService extends Service {
  repository = getRepository(Article)

  async list(options) {
    const {
      articleId,
      index,
      size,
      title,
      orderBy,
      user,
      category: { sortIdsArr = [], cateIdsArr = [] },
      tagIdsArr,
    } = options
    const orderByMap: Record<string, 'ASC' | 'DESC'> = {}
    if (orderBy.name && ['title', 'createDate', 'updateDate'].includes(orderBy.name)) orderByMap[`article.${orderBy.name}`] = orderBy.by
    if (!orderBy.name || !['isTop'].includes(orderBy.name)) orderByMap['article.isTop'] = 'DESC'
    if (!orderBy.name || !['createDate', 'updateDate'].includes(orderBy.name)) orderByMap['article.createDate'] = 'ASC'
    return await this.repository
      .createQueryBuilder('article')
      .innerJoinAndSelect('article.category', 'category')
      .innerJoinAndSelect('article.user', 'user')
      .innerJoinAndSelect('category.sort', 'sort')
      .leftJoinAndSelect('article.tags', 'tag')
      .where('article.title like :title', { title: `%${title}%` })
      .andWhere((qb) => {
        if (!tagIdsArr.length) return '1=1'
        const subQuery = qb
          .subQuery()
          .select('article.id')
          .from(Article, 'article')
          .innerJoin('article.tags', 'tag', `tag.id in (:...tagIdsArr)`, { tagIdsArr })
          .getQuery()
        return `article.id in ${subQuery}`
      })
      .andWhere(articleId ? `article.id=${articleId}` : '1=1')
      .andWhere('article.user=:userId', { userId: user.id })
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

  async content(options) {
    const { articleId } = options
    return await getRepository(Content).findOne({ article: articleId })
  }

  async save(options) {
    const { content, id, imageUrl = '/public/assets/images/default/article.jpeg' } = options
    const contentEntity = id ? await getRepository(Content).findOne({ article: id }) : {}
    let flag = true
    const articleEntity = this.repository.create({ ...options, imageUrl, content: { ...contentEntity, content } })
    await this.repository.save(articleEntity).catch(() => {
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
      .update(Article)
      .set({ isEnable: 0 })
      .where('id in (:...ids)', { ids })
      .execute()
    return Boolean(result.raw.affectedRows)
  }

  async unlock(ids: number[]) {
    const result = await this.repository
      .createQueryBuilder()
      .update(Article)
      .set({ isEnable: 1 })
      .where('id in (:...ids)', { ids })
      .execute()
    return Boolean(result.raw.affectedRows)
  }

  async top(ids: number[]) {
    const result = await this.repository.createQueryBuilder().update(Article).set({ isTop: 1 }).where('id in (:...ids)', { ids }).execute()
    return Boolean(result.raw.affectedRows)
  }

  async unTop(ids: number[]) {
    const result = await this.repository.createQueryBuilder().update(Article).set({ isTop: 0 }).where('id in (:...ids)', { ids }).execute()
    return Boolean(result.raw.affectedRows)
  }
}
