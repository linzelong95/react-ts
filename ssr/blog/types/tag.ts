import type { ISort } from '@ssr/blog/types'

export default interface ITag {
  listItem: {
    id: number
    createDate: string
    updateDate: string
    isEnable: 0 | 1
    isUsed: 0 | 1
    name: string
    sort: Omit<ISort['listItem'], 'categories'>
  }
  getListRes: {
    list: ITag['listItem'][]
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
