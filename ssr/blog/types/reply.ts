import type { IUser } from '@ssr/common/types'

export default interface IReply {
  listItem: {
    id: number
    createDate: string
    isApproved: 0 | 1
    isTop: 0 | 1
    reply: string
    parentId?: number
    from: IUser['listItem']
    to: IUser['listItem']
    children: IReply['listItem'][]
  }
  getListRes: {
    list: IReply['listItem'][]
    total: number
  }
  getListParams: Partial<{
    page?: number
    size?: number
    articleIds: number | string
    orderName: 'isApproved' | 'isTop' | 'createDate'
    orderBy: 'ASC' | 'DESC'
  }>
  // 编辑service的入参ts
  editParams: {
    articleId: number
    reply: string
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
