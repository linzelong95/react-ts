import React, { memo, useMemo, useState, useCallback, useRef, useEffect } from 'react'
import { WrappedContainer } from '@common/components'
import { useService } from '@common/hooks'
import { message, Row, Col, Button, List, Checkbox, Avatar, Tag, Input, Tooltip, Badge } from 'antd'
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
} from '@ant-design/icons'
import EditForm from '@blog-admin/components/reply/edit-form'
import FilterModal, { FilterModalRef, TemporaryCondition } from '@blog-admin/components/reply/filter-modal'
import moment from 'moment'
import { adminReplyServices } from '@blog-admin/services/reply'
import type { FC, ReactNode } from 'react'
import type { RouteComponentProps } from 'react-router'
import type { ReplyTypeCollection } from '@blog-admin/types'
import type { ButtonProps } from 'antd/lib/button'
import type { PaginationProps } from 'antd/lib/pagination'
import type { SearchProps } from 'antd/lib/input/Search'
import type { TagProps } from 'antd/lib/tag'

export type ListItem = ReplyTypeCollection['listItemByAdminRole']
export type ToggleEditorialPanel = (record?: ListItem) => void
export type SaveData = (params: ReplyTypeCollection['editParams'], callback?: () => void) => void
export type HandleItems = (type: 'remove' | 'approve' | 'disapprove' | 'top' | 'unTop', record?: ListItem, callback?: () => void) => void
export type ConditionQuery = ReplyTypeCollection['getListParamsByAdminRole']['conditionQuery'] & Pick<TemporaryCondition, 'commonFilterArr'>

const MessageManagement: FC<RouteComponentProps> = memo(() => {
  const inputSearchRef = useRef<Input>(null)
  const filterModalRef = useRef<FilterModalRef>(null)
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({ current: 1, pageSize: 10 })
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [editFormData, setEditFormData] = useState<ListItem>(null)
  const [selectedItems, setSelectedItems] = useState<ListItem[]>([])
  const [allSelectedFlag, setAllSelectedFlag] = useState<boolean>(false)
  const [conditionQuery, setConditionQuery] = useState<ConditionQuery>({})
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false)
  const [showSorterFlag, setShowSorterFlag] = useState<boolean>(false)

  const getListParams = useMemo<ReplyTypeCollection['getListParamsByAdminRole']>(
    () => ({
      index: pagination.current,
      size: pagination.pageSize,
      conditionQuery: conditionQuery,
    }),
    [pagination, conditionQuery],
  )
  const [loading, replyRes, replyErr, forceRequest] = useService(adminReplyServices.getList, getListParams)
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

  const toggleEditorialPanel = useCallback<(record?: ListItem) => void>((record) => {
    setEditFormData(record)
    setEditFormVisible((prevValue) => !prevValue)
  }, [])

  const saveData = useCallback<SaveData>(
    async (params, callback) => {
      message.loading({ content: '正在提交...', key: 'saveData', duration: 0 })
      const [, saveErr] = await adminReplyServices.save(params)
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
      const [, err] = await adminReplyServices[type]({ items: handlingItems })
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

  useEffect(() => {
    setAllSelectedFlag(
      !dataSource?.length ? false : dataSource.every((listItem) => selectedItems.some((selectedItem) => selectedItem.id === listItem.id)),
    )
  }, [selectedItems, dataSource])

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
              // danger={temporaryCondition.filterFlag}
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
                      handleItems('approve')
                    }}
                    style={{ marginLeft: 10 }}
                  >
                    展示
                  </Button>
                  <Button
                    icon={<EyeInvisibleOutlined />}
                    type="primary"
                    size="small"
                    onClick={() => {
                      handleItems('disapprove')
                    }}
                    style={{ marginLeft: 10 }}
                  >
                    隐藏
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
                    {conditionQuery?.orderBy?.name === 'isApproved' && conditionQuery?.orderBy?.by === 'DESC' ? (
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
          <List.Item
            style={{ background: selectedItems.map((i) => i.id).includes(item.id) && '#FFFFE0' }}
            key={item.id}
            actions={[
              <span key="createDate">{moment(new Date(item.createDate)).format('YYYY-MM-DD')}</span>,
              <Button
                key="remove"
                size="small"
                type="primary"
                danger
                onClick={() => {
                  handleItems('remove', item)
                }}
              >
                删除
              </Button>,
              <Button
                key="reply"
                size="small"
                type="primary"
                onClick={() => {
                  toggleEditorialPanel(item)
                }}
              >
                回复
              </Button>,
              <Button
                key="ifPass"
                size="small"
                type="primary"
                onClick={() => {
                  handleItems(item.isApproved ? 'disapprove' : 'approve', item)
                }}
              >
                {item.isApproved ? '隐藏' : '过审'}
              </Button>,
              <Button
                key="isTop"
                size="small"
                type="primary"
                onClick={() => {
                  handleItems(item.isTop ? 'unTop' : 'top', item)
                }}
              >
                {item.isTop ? '取置' : '置顶'}
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <>
                  <Checkbox
                    checked={allSelectedFlag || selectedItems.map((selectedItem) => selectedItem.id).includes(item.id)}
                    onChange={() => {
                      toggleSelectOne(item)
                    }}
                    style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}
                  />
                  <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png" />
                </>
              }
              title={
                <span>
                  《{item.article.title}》{item.parentId === 0 && <Tag color="cyan">父</Tag>}
                  {item.isTop === 1 && <Tag color="magenta">已置顶</Tag>}
                  {item.isApproved === 0 && <Tag color="orange">待审核</Tag>}
                </span>
              }
              description={
                <span>
                  <span style={{ color: 'green', fontWeight: 'bold' }}>
                    <i>{item.from.nickName}&nbsp;</i>
                  </span>
                  回复&nbsp;
                  <span style={{ color: '#A0522D', fontWeight: 'bold' }}>
                    <i>{item.parentId === 0 ? '该文' : item.to.nickName}&nbsp;</i>:
                  </span>
                  &nbsp;<b style={{ color: 'black' }}>{`“${item.reply}”`}</b>
                </span>
              }
            />
          </List.Item>
        )}
      />
    )
  }, [
    loading,
    dataSource,
    total,
    pagination,
    allSelectedFlag,
    selectedItems,
    pageChange,
    toggleSelectOne,
    handleItems,
    toggleEditorialPanel,
  ])

  const filterModalComponent = useMemo(() => {
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
        <EditForm visible={editFormVisible} initialValues={editFormData} onToggleEditorialPanel={toggleEditorialPanel} onSave={saveData} />
      )
    )
  }, [editFormVisible, editFormData, toggleEditorialPanel, saveData])

  return (
    <WrappedContainer>
      {actionBarComponent}
      {contentListComponent}
      {editFormComponent}
      {filterModalComponent}
    </WrappedContainer>
  )
})

export default MessageManagement
