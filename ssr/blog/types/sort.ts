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
}
