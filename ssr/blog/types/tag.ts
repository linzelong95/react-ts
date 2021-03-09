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
    index: number
    size: number
    conditionQuery: Partial<{
      isEnable: 0 | 1
      name: string
      orderBy: { name: 'name' | 'isEnable' | 'createDate' | 'updateDate'; by: 'ASC' | 'DESC' }
      sortIdsArr: number[]
      id: number
    }>
  }>
}
