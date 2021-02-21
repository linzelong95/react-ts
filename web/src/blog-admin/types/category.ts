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
    conditionQuery?: { isEnable?: boolean; name?: string; orderBy?: Record<string, string>; sortIdsArr?: number[]; id?: number }
  }
  // 添加函数的入参ts
  insertParams: Pick<Sort['listItemByAdminRole'], 'isEnable' | 'name'> & { sortId: number }
}
