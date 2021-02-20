import type { Sort } from '@blog-admin/types'

export default interface Category {
  listItem: {
    id: number
    createDate: string
    updateDate: string
    isEnable: 0 | 1
    isUsed: 0 | 1
    name: string
    sort: Omit<Sort['listItem'], 'categories'>
  }
  getListRes: {
    list: Sort['listItem'][]
    total: number
  }
  adminGetListParams: {
    index?: number
    size?: number
    conditionQuery?: { isEnable?: boolean; name?: string; orderBy?: Record<string, string>; sortIdsArr?: number[]; id?: number }
  }
}
