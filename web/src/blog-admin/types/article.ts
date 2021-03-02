import type { Category, TagTypeCollection } from '@blog-admin/types'

export default interface Article {
  listItemByAdminRole: {
    id: number
    createDate: string
    updateDate: string
    isEnable: 0 | 1
    isTop: 0 | 1
    abstract: string
    imageUrl: string
    title: string
    tags: TagTypeCollection['listItemByAdminRole'][]
    category: Category['listItemByAdminRole']
  }
  getListResByAdminRole: {
    list: Article['listItemByAdminRole'][]
    total: number
  }
  getListParamsByAdminRole: {
    index?: number
    size?: number
    conditionQuery?: Partial<{
      isEnable: 0 | 1
      isTop: 0 | 1
      title: string
      orderBy: { name: 'title' | 'isTop' | 'isEnable' | 'createDate' | 'updateDate'; by: 'ASC' | 'DESC' }
      sortIdsArr: number[]
      id: number
    }>
  }
  // 添加service函数的入参ts
  editParams: Pick<Article['listItemByAdminRole'], 'isEnable' | 'title'> & { id?: number; sortId: number }
  // 编辑时form的初始值
  formDataWhenEdited: {
    title?: string
    content?: string
    category?: [number, number]
    isTop?: 0 | 1
    sort?: {
      key: number
      label: string
    }
    tags?: { key: number; label: string }[]
  }
  // 删除service函数的入参ts
  removeParams: { items: { id: number; name?: string }[] }
  // 锁定service函数的入参ts
  lockParams: { items: { id: number; name?: string }[] }
  // 解锁service函数的入参ts
  unlockParams: { items: { id: number; name?: string }[] }
}
