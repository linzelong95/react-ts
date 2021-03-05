import React, { memo, useMemo, useState, useCallback, useRef, useEffect } from 'react'
import { WrappedContainer, Ellipsis } from '@common/components'
import { useService } from '@common/hooks'
import { message, Row, Col, Button, List, Card, Tag, Input, Tooltip, Badge, Checkbox } from 'antd'
import {
  EyeOutlined,
  DeleteOutlined,
  HomeOutlined,
  ReloadOutlined,
  PlusOutlined,
  StarOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  EyeInvisibleOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignMiddleOutlined,
  FilterOutlined,
  AlignCenterOutlined,
  TagsOutlined,
} from '@ant-design/icons'
import EditForm from '@blog-admin/components/article/edit-form'
import DetailDrawer from '@blog-admin/components/article/detail-drawer'
import FilterModal, { FilterModalRef, TemporaryCondition } from '@blog-admin/components/article/filter-modal'
import moment from 'moment'
import { adminArticleServices } from '@blog-admin/services/article'
import { adminSortServices } from '@blog-admin/services/sort'
import type { FC, ReactNode } from 'react'
import type { RouteComponentProps } from 'react-router'
import type { ArticleTypeCollection, Sort } from '@blog-admin/types'
import type { ButtonProps } from 'antd/lib/button'
import type { PaginationProps } from 'antd/lib/pagination'
import type { SearchProps } from 'antd/lib/input/Search'
import type { TagProps } from 'antd/lib/tag'

export type ListItem = ArticleTypeCollection['listItemByAdminRole']
export type ToggleEditorialPanel = (record?: ListItem) => void
export type SaveData = (params: ArticleTypeCollection['editParams'], callback?: () => void) => void
export type HandleItems = (type: 'remove' | 'lock' | 'unlock' | 'top' | 'unTop', record?: ListItem, callback?: () => void) => void
export type ConditionQuery = ArticleTypeCollection['getListParamsByAdminRole']['conditionQuery'] & TemporaryCondition
type ToggleReadArticle = (record?: ListItem) => void
export type DetailItem = ListItem & { content: string }

const ArticleManagement: FC<RouteComponentProps> = memo(() => {
  const inputSearchRef = useRef<Input>(null)
  const filterModalRef = useRef<FilterModalRef>(null)
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({ current: 1, pageSize: 10 })
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [editFormData, setEditFormData] = useState<DetailItem>(null)
  const [selectedItems, setSelectedItems] = useState<ListItem[]>([])
  const [allSelectedFlag, setAllSelectedFlag] = useState<boolean>(false)
  const [conditionQuery, setConditionQuery] = useState<ConditionQuery>({})
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false)
  const [showSorterFlag, setShowSorterFlag] = useState<boolean>(false)
  const [allSortList, setAllSortList] = useState<Sort['getListResByAdminRole']['list']>([])
  const [oneDetail, setOneDetail] = useState<DetailItem>(null)

  const getListParams = useMemo<ArticleTypeCollection['getListParamsByAdminRole']>(() => {
    const neededConditionQuery = { ...conditionQuery, tagIdsArr: undefined, filteredSortArr: undefined }
    return {
      index: pagination.current,
      size: pagination.pageSize,
      conditionQuery: neededConditionQuery,
    }
  }, [pagination, conditionQuery])

  const [loading, replyRes, replyErr, forceRequest] = useService(adminArticleServices.getList, getListParams)

  const [total, dataSource] = useMemo(() => {
    if (replyErr) {
      message.error(replyErr.message || '获取列表失败')
      return [0, []]
    }
    return [replyRes?.data?.total || 0, replyRes?.data?.list || []]
  }, [replyRes, replyErr])

  const showDataByDefaultWay = useCallback<(event: React.MouseEvent<HTMLElement, MouseEvent>) => void>(() => {
    setConditionQuery({})
    filterModalRef.current?.clear()
    inputSearchRef.current?.setValue?.('')
    setPagination((prevValue) => ({ ...prevValue, current: 1 }))
  }, [])

  const handleSearch = useCallback<SearchProps['onSearch']>((value) => {
    setPagination((prevValue) => ({ ...prevValue, current: 1 }))
    setConditionQuery((prevValue) => ({ ...prevValue, reply: value.trim() }))
  }, [])

  const toggleEditorialPanel = useCallback<(record?: ListItem) => void>(async (record) => {
    if (!record) {
      setEditFormVisible((prevValue) => !prevValue)
      return
    }
    const [contentRes, contentErr] = await adminArticleServices.getContent({ articleId: record.id })
    if (contentErr) {
      message.error('获取内容详情失败')
      return
    }
    setEditFormData({ ...record, content: contentRes.data })
    setEditFormVisible((prevValue) => !prevValue)
  }, [])

  const saveData = useCallback<SaveData>(
    async (params, callback) => {
      message.loading({ content: '正在提交...', key: 'saveData', duration: 0 })
      const [, saveErr] = await adminArticleServices.save(params)
      if (saveErr) {
        message.error({ content: saveErr.message || '提交失败', key: 'saveData' })
        return
      }
      if (callback) callback()
      message.success({ content: '操作成功', key: 'saveData' })
      const { pageSize, current } = pagination
      if (dataSource?.length === pageSize) {
        setPagination((prevValue) => ({ ...prevValue, current: current + 1 }))
      } else {
        forceRequest()
      }
    },
    [pagination, dataSource, forceRequest],
  )

  const toggleSelectAll = useCallback<ButtonProps['onClick']>(() => {
    if (!dataSource?.length) return
    const uniqueSelectedItems = dataSource.filter((dataItem) => !selectedItems.some((selectedItem) => selectedItem.id === dataItem.id))
    const newSelectedItems = allSelectedFlag
      ? selectedItems.filter((selectedItem) => !dataSource.some((dataItem) => dataItem.id === selectedItem.id))
      : [...selectedItems, ...uniqueSelectedItems]
    setSelectedItems(newSelectedItems)
    setAllSelectedFlag(!allSelectedFlag)
  }, [dataSource, selectedItems, allSelectedFlag])

  const toggleSelectOne = useCallback<ToggleEditorialPanel>(
    (record) => {
      const newSelectedItems = selectedItems.some((selectedItem) => selectedItem.id === record.id)
        ? selectedItems.filter((selectedItem) => selectedItem.id !== record.id)
        : [...selectedItems, record]
      setSelectedItems(newSelectedItems)
      setAllSelectedFlag(
        !dataSource?.length
          ? false
          : dataSource.every((listItem) => newSelectedItems.some((selectedItem) => selectedItem.id === listItem.id)),
      )
    },
    [selectedItems, dataSource],
  )

  const toggleShowSorter = useCallback<() => void>(() => {
    setShowSorterFlag((prevValue) => !prevValue)
  }, [])

  const handleSort = useCallback<TagProps['onClick']>(
    ({ currentTarget }) => {
      const { id } = currentTarget
      if (id === 'default') {
        setConditionQuery((prevValue) => ({ ...prevValue, orderBy: undefined }))
        toggleShowSorter()
        return
      }
      setConditionQuery((prevValue) => ({
        ...prevValue,
        orderBy: {
          name: id,
          by: prevValue?.orderBy?.by === 'ASC' ? 'DESC' : 'ASC',
        } as ConditionQuery['orderBy'],
      }))
      setPagination((prevValue) => ({ ...prevValue, current: 1 }))
    },
    [toggleShowSorter],
  )

  const pageChange = useCallback<PaginationProps['onChange']>((current, pageSize) => {
    setPagination({ current, pageSize })
  }, [])

  const handleItems = useCallback<HandleItems>(
    async (type, record, callback) => {
      const handlingItems = (record ? [record] : selectedItems).map((item) => ({ id: item.id }))
      const [, err] = await adminArticleServices[type]({ items: handlingItems })
      if (err) {
        message.error('操作失败')
        return
      }
      if (callback) callback()
      message.success('操作成功')
      setSelectedItems([])
      const { current } = pagination
      if (type === 'remove' && handlingItems?.length > dataSource?.length) {
        setPagination((prevValue) => ({ ...prevValue, current: current - 1 || 0 }))
      } else {
        forceRequest()
      }
    },
    [selectedItems, pagination, dataSource, forceRequest],
  )

  const toggleReadArticle = useCallback<ToggleReadArticle>(async (record?) => {
    if (!record) {
      setOneDetail(null)
      return
    }
    const [contentRes, contentErr] = await adminArticleServices.getContent({ articleId: record.id })
    if (contentErr) {
      message.error('获取内容详情失败')
      return
    }
    setOneDetail({ ...record, content: contentRes.data })
  }, [])

  useEffect(() => {
    setAllSelectedFlag(
      !dataSource?.length ? false : dataSource.every((listItem) => selectedItems.some((selectedItem) => selectedItem.id === listItem.id)),
    )
  }, [selectedItems, dataSource])

  useEffect(() => {
    ;(async () => {
      const [sortRes] = await adminSortServices.getList({ index: 1, size: 999 })
      setAllSortList(sortRes?.data?.list || [])
    })()
  }, [])

  const actionBarComponent = useMemo<ReactNode>(() => {
    return (
      <>
        <Row align="middle" style={{ marginBottom: 15 }}>
          <Col xs={12} sm={13} md={15} lg={16} xl={17}>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              size="small"
              onClick={() => {
                toggleEditorialPanel()
              }}
            >
              新增
            </Button>
            <Button
              icon={<FilterOutlined />}
              type="primary"
              danger={Boolean(conditionQuery?.filteredSortArr?.length || conditionQuery?.tagIdsArr?.length)}
              size="small"
              onClick={() => {
                setFilterModalVisible(true)
              }}
              style={{ marginLeft: 10 }}
            >
              筛选
            </Button>
            <Button
              icon={<StarOutlined />}
              type="primary"
              danger={allSelectedFlag}
              size="small"
              onClick={toggleSelectAll}
              style={{ marginLeft: 10 }}
            >
              {allSelectedFlag ? '反选' : '全选'}
              &nbsp;
            </Button>
            <Button
              icon={<AlignCenterOutlined />}
              type="primary"
              danger={showSorterFlag}
              size="small"
              onClick={toggleShowSorter}
              style={{ marginLeft: 10 }}
            >
              排序
            </Button>
          </Col>
          <Col xs={2} sm={2} md={1} lg={1} xl={1}>
            <Tooltip title="默认展示">
              <Button type="primary" icon={<HomeOutlined />} shape="circle" size="small" onClick={showDataByDefaultWay} />
            </Tooltip>
          </Col>
          <Col xs={10} sm={9} md={8} lg={7} xl={6}>
            <Input.Search ref={inputSearchRef} placeholder="Enter something" onSearch={handleSearch} enterButton allowClear />
          </Col>
        </Row>
        {(selectedItems?.length > 0 || showSorterFlag) && (
          <Row align="middle" justify="space-between" style={{ marginBottom: 15 }}>
            <Col>
              {selectedItems?.length > 0 && (
                <>
                  <Badge count={selectedItems.length} title="已选项数">
                    <Button
                      icon={<ReloadOutlined />}
                      type="primary"
                      size="small"
                      onClick={() => {
                        setSelectedItems([])
                      }}
                    >
                      清空
                    </Button>
                  </Badge>
                  <Button
                    icon={<DeleteOutlined />}
                    type="primary"
                    danger
                    size="small"
                    onClick={() => {
                      handleItems('remove')
                    }}
                    style={{ marginLeft: 10 }}
                  >
                    删除
                  </Button>
                  <Button
                    icon={<EyeOutlined />}
                    type="primary"
                    size="small"
                    onClick={() => {
                      handleItems('unlock')
                    }}
                    style={{ marginLeft: 10 }}
                  >
                    启动
                  </Button>
                  <Button
                    icon={<EyeInvisibleOutlined />}
                    type="primary"
                    size="small"
                    onClick={() => {
                      handleItems('lock')
                    }}
                    style={{ marginLeft: 10 }}
                  >
                    禁用
                  </Button>
                  <Button
                    icon={<VerticalAlignTopOutlined />}
                    type="primary"
                    size="small"
                    onClick={() => {
                      handleItems('top')
                    }}
                    style={{ marginLeft: 10 }}
                  >
                    置顶
                  </Button>
                  <Button
                    icon={<VerticalAlignMiddleOutlined />}
                    type="primary"
                    size="small"
                    onClick={() => {
                      handleItems('unTop')
                    }}
                    style={{ marginLeft: 10 }}
                  >
                    取置
                  </Button>
                </>
              )}
            </Col>
            <Col>
              {showSorterFlag && (
                <>
                  <Tag color="magenta" id="default" style={{ marginLeft: 10, cursor: 'pointer' }} onClick={handleSort}>
                    默认
                  </Tag>
                  <Tag color="magenta" id="createDate" style={{ cursor: 'pointer' }} onClick={handleSort}>
                    时间
                    {conditionQuery?.orderBy?.name === 'createDate' && conditionQuery?.orderBy?.by === 'DESC' ? (
                      <CaretDownOutlined />
                    ) : (
                      <CaretUpOutlined />
                    )}
                  </Tag>
                  <Tag color="magenta" id="isApproved" style={{ cursor: 'pointer' }} onClick={handleSort}>
                    显示
                    {conditionQuery?.orderBy?.name === 'isEnable' && conditionQuery?.orderBy?.by === 'DESC' ? (
                      <CaretDownOutlined />
                    ) : (
                      <CaretUpOutlined />
                    )}
                  </Tag>
                  <Tag color="magenta" id="isTop" style={{ cursor: 'pointer' }} onClick={handleSort}>
                    置顶
                    {conditionQuery?.orderBy?.name === 'isTop' && conditionQuery?.orderBy?.by === 'DESC' ? (
                      <CaretDownOutlined />
                    ) : (
                      <CaretUpOutlined />
                    )}
                  </Tag>
                </>
              )}
            </Col>
          </Row>
        )}
      </>
    )
  }, [
    showSorterFlag,
    conditionQuery,
    selectedItems,
    allSelectedFlag,
    toggleEditorialPanel,
    toggleSelectAll,
    handleItems,
    showDataByDefaultWay,
    handleSearch,
    toggleShowSorter,
    handleSort,
  ])

  const contentListComponent = useMemo<ReactNode>(() => {
    return (
      <List
        loading={loading}
        dataSource={dataSource}
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: pageChange,
          onShowSizeChange: pageChange,
          pageSizeOptions: ['10', '20', '30', '40'],
          defaultPageSize: 10,
          total,
          ...pagination,
        }}
        renderItem={(item) => (
          <List.Item style={{ background: 'lightgray', borderRadius: 5 }}>
            <Card
              size="small"
              cover={<img alt="cover" src={item.imageUrl || `${__SERVER_ORIGIN__ || ''}/public/assets/images/default/article.jpeg`} />}
              actions={[
                <Button key="form" size="small" type="primary" onClick={() => toggleEditorialPanel(item)}>
                  编辑
                </Button>,
                <Button key="delete" size="small" type="primary" danger onClick={() => handleItems('remove', item)}>
                  删除
                </Button>,
                <Button key="whetherTop" size="small" type="primary" onClick={() => handleItems(item.isTop === 1 ? 'unTop' : 'top', item)}>
                  {item.isTop === 1 ? '取置' : '置顶'}
                </Button>,
                <Button
                  key="whetherLock"
                  size="small"
                  type="primary"
                  onClick={() => handleItems(item.isEnable === 1 ? 'lock' : 'unlock', item)}
                >
                  {item.isEnable === 1 ? '禁用' : '启用'}
                </Button>,
                <div key="select" style={{ width: '100%', height: '100%' }} onClick={() => toggleSelectOne(item)}>
                  <Checkbox checked={selectedItems.some(({ id }) => id === item.id)} />,
                </div>,
              ]}
              style={{
                position: 'relative',
                overflow: 'hidden',
                background: (selectedItems.some(({ id }) => id === item.id) && '#FFFFE0') || (!item.isEnable && '#fafafa'),
              }}
            >
              <Card.Meta
                title={
                  <Tooltip title={item.title}>
                    <div style={{ cursor: 'pointer' }} onClick={() => toggleReadArticle(item)}>
                      {item.title}
                    </div>
                  </Tooltip>
                }
                description={
                  <>
                    <div style={{ marginBottom: 5, fontSize: 12 }}>
                      <Ellipsis lines={1}>
                        标签：
                        {item?.tags?.length > 0 ? item.tags.map((tag) => <Tag key={tag.id}>{tag.name}</Tag>) : '无'}
                      </Ellipsis>
                    </div>
                    <Ellipsis lines={2} style={{ height: 40 }}>
                      摘要：
                      {item?.abstract || '无'}
                    </Ellipsis>
                    <div style={{ marginTop: 5, fontSize: 12 }}>
                      <div style={{ float: 'left' }}>{moment(new Date(item.createDate)).format('YYYY-MM-DD')}</div>
                      <div style={{ float: 'right' }}>{moment(new Date(item.updateDate)).format('YYYY-MM-DD')}</div>
                    </div>
                  </>
                }
              />
              {item.isTop === 1 && (
                <div
                  style={{
                    position: 'absolute',
                    background: 'gray',
                    top: 5,
                    right: -55,
                    width: 150,
                    textAlign: 'center',
                    overflow: 'hidden',
                    transform: 'rotate(40deg)',
                  }}
                >
                  <span style={{ color: 'yellow' }}>置顶</span>
                </div>
              )}
              <Tag color="purple" style={{ position: 'absolute', top: 0, left: 0 }}>
                <TagsOutlined style={{ marginRight: 10 }} />
                {item.category.sort.name},{item.category.name}
              </Tag>
            </Card>
          </List.Item>
        )}
      />
    )
  }, [
    loading,
    dataSource,
    total,
    pagination,
    selectedItems,
    toggleReadArticle,
    pageChange,
    toggleSelectOne,
    handleItems,
    toggleEditorialPanel,
  ])

  const filterModalComponent = useMemo<ReactNode>(() => {
    return (
      <FilterModal
        ref={filterModalRef}
        visible={filterModalVisible}
        conditionQuery={conditionQuery}
        onSetFilterModalVisible={setFilterModalVisible}
        onSetConditionQuery={setConditionQuery}
      />
    )
  }, [filterModalVisible, conditionQuery])

  const editFormComponent = useMemo<ReactNode>(() => {
    return (
      editFormVisible && (
        <EditForm
          visible={editFormVisible}
          initialValues={editFormData}
          allSortList={allSortList}
          onToggleEditorialPanel={toggleEditorialPanel}
          onSave={saveData}
        />
      )
    )
  }, [editFormVisible, editFormData, allSortList, toggleEditorialPanel, saveData])

  const detailDrawerComponent = useMemo<ReactNode>(() => {
    return oneDetail && <DetailDrawer detailItem={oneDetail} visible={Boolean(oneDetail)} onClose={() => toggleReadArticle()} />
  }, [oneDetail, toggleReadArticle])

  return (
    <WrappedContainer>
      {actionBarComponent}
      {contentListComponent}
      {editFormComponent}
      {filterModalComponent}
      {detailDrawerComponent}
    </WrappedContainer>
  )
})

export default ArticleManagement

// interface AppProps {
//   user: StoreState['user']
//   onClearUser: (flag?: boolean) => void
// }

// export default connect<Pick<AppProps, 'user'>, Pick<AppProps, 'onClearUser'>, Omit<AppProps, 'user' | 'onClearUser'>, StoreState>(
//   (state: StoreState) => ({
//     user: state.user,
//   }),
//   (dispatch: Dispatch<UserAction>) => ({
//     onClearUser: (flag?: boolean) => dispatch({ type: UserActionType.LOGOUT }),
//   }),
// )(Article)
