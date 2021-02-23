export default interface Message {
  listItemByAdminRole: {
    id: number
    createDate: string
    isApproved: 0 | 1
    isTop: 0 | 1
    message: string
    parentId?: number
    blog?: string
    fromMail: string
    from: {
      id: number
      account: string
      nickName?: string
      roleName: string
    }
    toMail: string
    to: Message['listItemByAdminRole']['from']
  }
  getListResByAdminRole: {
    list: Message['listItemByAdminRole'][]
    total: number
  }
  getListParamsByAdminRole: {
    index?: number
    size?: number
    conditionQuery?: {
      category?: Record<string, any>
      title?: string
      orderBy?: { name: 'isApproved' | 'isTop' | 'createDate'; by: 'ASC' | 'DESC' }
    }
  }
  // 编辑service的入参ts
  editParams: Pick<Message['listItemByAdminRole'], 'isTop' | 'message'> & { id?: number }
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
