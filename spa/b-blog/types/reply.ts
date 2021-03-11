import type { IUser } from '@common/types'
import type { IArticle } from '@b-blog/types'

export default interface Reply {
  listItem: {
    id: number
    createDate: string
    isApproved: 0 | 1
    isTop: 0 | 1
    reply: string
    parentId?: number
    article: IArticle['listItem']
    from: IUser['listItem']
    to: IUser['listItem']
  }
  getListRes: {
    list: Reply['listItem'][]
    total: number
  }
  getListParams: {
    index?: number
    size?: number
    conditionQuery?: Partial<{
      prettyFormat: boolean
      isTop: 0 | 1
      isApproved: 0 | 1
      isRoot: 0 | 1
      reply: string
      articleIdsArr: number[]
      category: { sortIdsArr?: number[]; cateIdsArr?: number[] }
      orderBy: { name: 'isApproved' | 'isTop' | 'createDate'; by: 'ASC' | 'DESC' }
    }>
  }
  // 编辑service的入参ts
  editParams: {
    articleId: number
    reply: string
    isTop?: 0 | 1
    toId?: number
    parentId?: number
  }
  // 编辑时form的初始值
  formDataWhenEdited: Partial<{
    reply: string
    to: {
      key: number
      label: string
    }
    isTop: 0 | 1
    parentId: number
    article: {
      key: number
      label: string
    }
  }>
  // 删除service的入参ts
  removeParams: { items: { id: number; name?: string; parentId?: number }[] }
  // 锁定service函数的入参ts
  topParams: { items: { id: number; name?: string; parentId?: number }[] }
  // 解锁service函数的入参ts
  unTopParams: { items: { id: number; name?: string; parentId?: number }[] }
  // 不展示service函数的入参ts
  disapproveParams: { items: { id: number; name?: string; parentId?: number }[] }
  // 展示/过审service函数的入参ts
  approveParams: { items: { id: number; name?: string; parentId?: number }[] }
}
