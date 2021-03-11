import { Subscription } from 'egg'
import { getRepository } from 'typeorm'
import { Sort } from '@entity/Sort'
import { Tag } from '@entity/Tag'
import { Category } from '@entity/Category'

export default class UpdateData extends Subscription {
  sortRepository = getRepository(Sort)
  tagRepository = getRepository(Tag)
  categoryRepository = getRepository(Category)

  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: 24 * 60 * 60 * 1000, // 1天
      type: 'worker', // 每台机器上只有一个 worker 会执行这个定时任务，每次执行定时任务的 worker 的选择是随机的
    }
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    console.log(11111)
    const tagsArr = await this.tagRepository
      .createQueryBuilder('tag')
      .leftJoinAndSelect('tag.articles', 'articles')
      .where('tag.isUsed=:isUsed', { isUsed: 1 })
      .getMany()
    const unUsedTagIds = tagsArr.filter((tag) => !tag.articles.length).map((item) => item.id)
    if (unUsedTagIds.length) {
      await this.tagRepository.createQueryBuilder().update(Tag).set({ isUsed: 0 }).where('id in (:...ids)', { ids: unUsedTagIds }).execute()
    }

    const categoriesArr = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.articles', 'articles')
      .where('category.isUsed=:isUsed', { isUsed: 1 })
      .getMany()
    const unUsedCategoryIds = categoriesArr.filter((category) => !category.articles.length).map((item) => item.id)
    if (unUsedCategoryIds.length) {
      await this.categoryRepository
        .createQueryBuilder()
        .update(Category)
        .set({ isUsed: 0 })
        .where('id in (:...ids)', { ids: unUsedCategoryIds })
        .execute()
    }

    const sortsArr = await this.sortRepository
      .createQueryBuilder('sort')
      .leftJoinAndSelect('sort.categories', 'categories', 'categories.isUsed=1')
      .leftJoinAndSelect('sort.tags', 'tags', 'tags.isUsed=1')
      .where('sort.isUsed=:isUsed', { isUsed: 1 })
      .getMany()
    const unUsedSortIds = sortsArr.filter((sort) => !sort.categories.length && !sort.tags.length).map((item) => item.id)
    if (unUsedSortIds.length) {
      await this.sortRepository
        .createQueryBuilder()
        .update(Sort)
        .set({ isUsed: 0 })
        .where('id in (:...ids)', { ids: unUsedSortIds })
        .execute()
    }
  }
}
