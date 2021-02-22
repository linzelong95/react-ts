import type { Sort } from '@blog-admin/types'

export default interface Category {
  listItemByAdminRole: {
    id: number
    createDate: string
    updateDate: string
    isEnable: 0 | 1
    isUsed: 0 | 1
    name: string
    sort: Omit<Sort['listItemByAdminRole'], 'categories'>
  }
  getListResByAdminRole: {
    list: Sort['listItemByAdminRole'][]
    total: number
  }
  getListParamsByAdminRole: {
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
  // 添加函数的入参ts
  editParams: Pick<Sort['listItemByAdminRole'], 'isEnable' | 'name'> & { id?: number; sortId: number }
  // 编辑时form的初始值
  formDataWhenEdited: {
    name?: string
    isEnable: 0 | 1
    sort?: {
      key: number
      label: string
    }
  }
  // 删除函数的入参ts
  removeParams: { items: { id: number; name: string }[] }
  // 锁定service函数的入参ts
  lockParams: { items: { id: number; name: string }[] }
  // 解锁service函数的入参ts
  unlockParams: { items: { id: number; name: string }[] }
}
