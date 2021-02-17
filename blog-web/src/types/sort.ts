export default interface Sort {
  getListRes: {
    list: any[]
    total: number
  }
  adminGetListParams: {
    index?: number
    size?: number
    conditionQuery?: { isEnable?: boolean; name?: string; orderBy?: Record<string, string>; sortIdsArr?: number[]; id?: number }
  }
}
