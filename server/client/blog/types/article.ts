import type { ICategory, ITag } from '@client/blog/types'
import type { IUser } from '@client/common/types'
import type { UploadProps } from 'antd/lib/upload'
import type { EditorState } from 'braft-editor'

export default interface Article {
  listItem: {
    id: number
    createDate: string
    updateDate: string
    isEnable: 0 | 1
    isTop: 0 | 1
    abstract: string
    imageUrl: string
    title: string
    tags: ITag['listItem'][]
    category: ICategory['listItem']
    user: IUser['listItem']
  }
  getListRes: {
    list: Article['listItem'][]
    total: number
  }
  getListParams: {
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
  editParams: {
    id?: number
    title: string
    abstract?: string
    content: string
    isTop: 0 | 1
    tags?: { id: number; name: string }[]
    imageUrl: string
    category: { id: number }
  }
  // 编辑时form的初始值
  formDataWhenEdited: {
    id?: number
    title?: string
    abstract?: string
    content?: EditorState
    category?: [number, number]
    isTop?: 0 | 1
    tags?: { key: number; label: string }[]
    imageUrl?: UploadProps['fileList']
  }
}
