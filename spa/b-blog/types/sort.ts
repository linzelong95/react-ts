import type { ICategory } from '@b-blog/types'
export default interface ISort {
  listItem: {
    id: number
    createDate: string
    updateDate: string
    isEnable: 0 | 1
    isUsed: 0 | 1
    name: string
    categories: Omit<ICategory['listItem'], 'sort'>[]
  }
  getListRes: {
    list: ISort['listItem'][]
    total: number
  }
  getListParams: {
    index?: number
    size?: number
    conditionQuery?: {
      isEnable?: 0 | 1
      name?: string
      orderBy?: { name: 'name' | 'isEnable' | 'createDate' | 'updateDate'; by: 'ASC' | 'DESC' }
      sortIdsArr?: number[]
      id?: number
    }
  }
  // 编辑service的入参ts
  editParams: Pick<ISort['listItem'], 'isEnable' | 'name'> & { id?: number }
  // 编辑时form的初始值
  formDataWhenEdited: {
    name?: string
    isEnable: 0 | 1
  }
  // 删除service的入参ts
  removeParams: { items: { id: number; name: string }[] }
  // 锁定service函数的入参ts
  lockParams: { items: { id: number; name: string }[] }
  // 解锁service函数的入参ts
  unlockParams: { items: { id: number; name: string }[] }
}
