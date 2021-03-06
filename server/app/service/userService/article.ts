import { Service } from 'egg'
import { getRepository } from 'typeorm'
import { Article } from '@entity/Article'
import { Content } from '@entity/Content'

export default class UserArticleService extends Service {
  repository = getRepository(Article)

  async list(options) {
    const { id, page, size, title, orderBy = {}, tagIdsArr, sortIdsArr = [], cateIdsArr = [] } = options
    const orderByMap: Record<string, 'ASC' | 'DESC'> = { 'article.isTop': 'DESC' }
    if (['title', 'createDate', 'updateDate'].includes(orderBy.name)) orderByMap[`article.${orderBy.name}`] = orderBy.by
    if (!orderBy.name || !['createDate', 'updateDate'].includes(orderBy.name)) orderByMap['article.createDate'] = 'ASC'
    return await this.repository
      .createQueryBuilder('article')
      .innerJoinAndSelect('article.category', 'category', 'category.isEnable=1')
      .innerJoinAndSelect('article.user', 'user')
      .innerJoinAndSelect('category.sort', 'sort', 'sort.isEnable=1')
      .leftJoinAndSelect('article.tags', 'tag', 'tag.isEnable=1')
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
      .andWhere(id ? `article.id=${id}` : '1=1')
      .andWhere('article.isEnable=1')
      .andWhere(sortIdsArr.length && !cateIdsArr.length ? `sort.id in (${sortIdsArr.join(',')})` : '1=1')
      .andWhere(!sortIdsArr.length && cateIdsArr.length ? `category.id in (${cateIdsArr.join(',')})` : '1=1')
      .andWhere(
        sortIdsArr.length && cateIdsArr.length ? `sort.id in (${sortIdsArr.join(',')}) or category.id in (${cateIdsArr.join(',')})` : '1=1',
      )
      .orderBy(orderByMap)
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount()
  }

  async detail(id) {
    const article = await this.repository
      .createQueryBuilder('article')
      .innerJoinAndSelect('article.category', 'category')
      .innerJoinAndSelect('article.user', 'user')
      .innerJoinAndSelect('category.sort', 'sort')
      .leftJoinAndSelect('article.tags', 'tag')
      .where(`article.id=${id}`)
      .getOne()
    const articleContent = await getRepository(Content).findOne({ article: id })
    return [article, articleContent]
  }
}
