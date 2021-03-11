import { Service } from 'egg'
import { getRepository } from 'typeorm'
import { User } from '@entity/User'

export default class UserArticleService extends Service {
  repository = getRepository(User)

  async list(options) {
    const { id, page, size, search } = options
    return await this.repository
      .createQueryBuilder('user')
      .where('user.account like :account', { account: `%${search}%` })
      .orWhere('user.nickname like :nickname', { nickname: `%${search}%` })
      .andWhere(id ? `user.id=${id}` : '1=1')
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount()
  }
}
