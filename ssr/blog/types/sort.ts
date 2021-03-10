import type { ICategory } from '@ssr/blog/types'

export default interface Sort {
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
    list: Sort['listItem'][]
    total: number
  }
  getListParams: Partial<{
    page: number
    size: number
    isEnable: 0 | 1
    name: string
    orderBy: 'ASC' | 'DESC'
    orderName: 'name' | 'isEnable' | 'createDate' | 'updateDate'
    sortIds: string
    id: number
  }>
}
