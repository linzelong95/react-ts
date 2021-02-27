import React, { memo, useMemo, useState, useCallback, useRef, useEffect } from 'react'
import { WrappedContainer } from '@common/components'
import { message, Row, Col, Button, List, Checkbox, Avatar, Tag, Input, Tooltip, Badge, Modal } from 'antd'
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
  SolutionOutlined,
} from '@ant-design/icons'
import EditForm from '@blog-admin/components/message/edit-form'
import MessageDrawer from '@blog-admin/components/message/message-drawer'
import moment from 'moment'
import { adminMessageServices } from '@blog-admin/services/message'
import type { FC, ReactNode } from 'react'
import type { RouteComponentProps } from 'react-router'
import type { Message } from '@blog-admin/types'
import type { ButtonProps } from 'antd/lib/button'
import type { PaginationProps } from 'antd/lib/pagination'
import type { SearchProps } from 'antd/lib/input/Search'
import type { TagProps } from 'antd/lib/tag'
import styles from './index.less'

export type ListItem = Message['listItemByAdminRole']
export type ToggleEditorialPanel = (record?: ListItem) => void
export type SaveData = (params: Message['editParams'], callback?: () => void) => void
export type HandleItems = (type: 'remove' | 'approve' | 'disapprove' | 'top' | 'unTop', record?: ListItem, callback?: () => void) => void
type FilterRequest = (type: 'ok' | 'exit' | 'clear') => void
type TemporaryCondition = {
  commonFilterArr?: ['isTop'?, 'isApproved'?, 'isParent'?, 'isSon'?]
  filterFlag?: boolean
}
type ConditionQuery = Message['getListParamsByAdminRole']['conditionQuery'] & Pick<TemporaryCondition, 'commonFilterArr'>

const MessageManagement: FC<RouteComponentProps> = memo(() => {
  const inputSearchRef = useRef<Input>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({ current: 1, pageSize: 10 })
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [editFormData, setEditFormData] = useState<ListItem>(null)
  const [dataSource, setDataSource] = useState<ListItem[]>([])
  const [selectedItems, setSelectedItems] = useState<ListItem[]>([])
  const [temporaryCondition, setTemporaryCondition] = useState<TemporaryCondition>({})
  const [allSelectedFlag, setAllSelectedFlag] = useState<boolean>(false)
  const [conditionQuery, setConditionQuery] = useState<ConditionQuery>({})
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false)
  const [showSorterFlag, setShowSorterFlag] = useState<boolean>(false)
  const [messageDrawerVisible, setMessageDrawerVisible] = useState<boolean>(false)

  const showDataByDefaultWay = useCallback<(event: React.MouseEvent<HTMLElement, MouseEvent>) => void>(() => {
    setConditionQuery({})
    setTemporaryCondition({})
    inputSearchRef.current?.setValue?.('')
    setPagination((prevValue) => ({ ...prevValue, current: 1 }))
  }, [])

  const handleSearch = useCallback<SearchProps['onSearch']>((value) => {
    setPagination((prevValue) => ({ ...prevValue, current: 1 }))
    setConditionQuery((prevValue) => ({ ...prevValue, message: value.trim() }))
  }, [])

  const toggleEditorialPanel = useCallback<(record?: ListItem) => void>((record) => {
    setEditFormData(record)
    setEditFormVisible((prevValue) => !prevValue)
  }, [])

  const saveData = useCallback<SaveData>(async (params, callback) => {
    message.loading({ content: '正在提交...', key: 'saveData', duration: 0 })
    const [, saveErr] = await adminMessageServices.save(params)
    if (saveErr) {
      message.error({ content: saveErr.message || '提交失败', key: 'saveData' })
      return
    }
    if (callback) callback()
    setPagination((prevValue) => ({ ...prevValue, current: 1 }))
    message.success({ content: '操作成功', key: 'saveData' })
  }, [])

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

  const toggleMessageDrawer = useCallback<() => void>(() => {
    setMessageDrawerVisible((prevValue) => !prevValue)
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
      const [, err] = await adminMessageServices[type]({ items: handlingItems })
      if (err) {
        message.error('操作失败')
        return
      }
      if (callback) callback()
      message.success('操作成功')
      setPagination((prevValue) => ({ ...prevValue, current: 1 }))
    },
    [selectedItems],
  )

  const filterRequest = useCallback<FilterRequest>(
    (type) => {
      if (type === 'clear') {
        setTemporaryCondition({})
        return
      }
      setFilterModalVisible((prevValue) => !prevValue)
      if (type === 'exit') {
        setTemporaryCondition((prevValue) => ({
          ...prevValue,
          commonFilterArr: conditionQuery?.commonFilterArr,
          filterFlag: conditionQuery?.commonFilterArr?.length > 0,
        }))
        return
      }
      setTemporaryCondition((prevValue = {}) => {
        const { commonFilterArr = [] } = prevValue
        const isApproved = commonFilterArr.includes?.('isApproved') ? 0 : undefined
        const isTop = commonFilterArr.includes?.('isTop') ? 1 : undefined
        const isRoot = (() => {
          if (commonFilterArr.includes('isParent') && !commonFilterArr.includes('isSon')) return 1
          if (!commonFilterArr.includes('isParent') && commonFilterArr.includes('isSon')) return 0
          return undefined
        })()
        setConditionQuery((oldValue) => ({
          ...oldValue,
          isApproved,
          isTop,
          isRoot,
          commonFilterArr,
        }))
        return { ...prevValue, filterFlag: prevValue?.commonFilterArr?.length > 0 }
      })
    },
    [conditionQuery],
  )

  useEffect(() => {
    setLoading(true)
    const neededConditionQuery = { ...conditionQuery, commonFilterArr: undefined }
    const params = { index: pagination.current, size: pagination.pageSize, conditionQuery: neededConditionQuery }
    ;(async () => {
      const [messageRes, messageErr] = await adminMessageServices.getList(params)
      if (messageErr || !Array.isArray(messageRes?.data?.list)) {
        message.error(messageErr.message || '获取列表失败')
        return
      }
      setLoading(false)
      setTotal(messageRes.data.total)
      setDataSource(messageRes.data.list)
    })()
  }, [pagination, conditionQuery])

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
              danger={temporaryCondition.filterFlag}
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
            <Button
              icon={<SolutionOutlined />}
              type="primary"
              danger={messageDrawerVisible}
              size="small"
              onClick={toggleMessageDrawer}
              style={{ marginLeft: 10 }}
            >
              视图
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
    temporaryCondition,
    selectedItems,
    allSelectedFlag,
    messageDrawerVisible,
    toggleMessageDrawer,
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
            className={styles.eachChild}
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
                  <span style={{ color: 'green', fontWeight: 'bold', marginRight: 10 }}>
                    <i>{item.from ? item.from.nickName : `${item.fromMail} [游客]`}</i>
                  </span>
                  的留言
                  {item.parentId > 0 && (
                    <span>
                      ( 回复
                      <i style={{ color: '#A0522D', fontWeight: 'bold', marginLeft: 10, marginRight: 10 }}>
                        {item.to ? item.to.nickName : `${item.toMail} [游客]`}
                      </i>
                      )
                    </span>
                  )}
                  &nbsp;:&nbsp;
                  {item.parentId === 0 && <Tag color="cyan">父</Tag>}
                  {item.isTop === 1 && <Tag color="magenta">已置顶</Tag>}
                  {item.isApproved === 0 && <Tag color="orange">待审核</Tag>}
                </span>
              }
              description={item.message}
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
      <Modal
        destroyOnClose
        visible={filterModalVisible}
        title="请选择筛选条件"
        onCancel={() => filterRequest('exit')}
        footer={[
          <Button key="exit" onClick={() => filterRequest('exit')}>
            不更改并退出
          </Button>,
          <Button key="clear" danger onClick={() => filterRequest('clear')}>
            清空
          </Button>,
          <Button key="ok" type="primary" onClick={() => filterRequest('ok')}>
            确定
          </Button>,
        ]}
      >
        <div style={{ textAlign: 'center' }}>
          <Checkbox.Group
            options={[
              { label: '置顶', value: 'isTop' },
              { label: '待审', value: 'isApproved' },
              { label: '父留言', value: 'isParent' },
              { label: '子留言', value: 'isSon' },
            ]}
            value={temporaryCondition?.commonFilterArr || []}
            onChange={(value) => {
              setTemporaryCondition((prevValue) => ({ ...prevValue, commonFilterArr: value } as TemporaryCondition))
            }}
          />
        </div>
      </Modal>
    )
  }, [filterModalVisible, temporaryCondition, filterRequest])

  const editFormComponent = useMemo<ReactNode>(() => {
    return (
      editFormVisible && (
        <EditForm visible={editFormVisible} initialValues={editFormData} onToggleEditorialPanel={toggleEditorialPanel} onSave={saveData} />
      )
    )
  }, [editFormVisible, editFormData, toggleEditorialPanel, saveData])

  const messageDrawerComponent = useMemo(() => {
    return (
      messageDrawerVisible && (
        <MessageDrawer
          visible={messageDrawerVisible}
          onToggleMessageDrawer={toggleMessageDrawer}
          onSave={saveData}
          onHandleItems={handleItems}
        />
      )
    )
  }, [messageDrawerVisible, toggleMessageDrawer, handleItems, saveData])

  return (
    <WrappedContainer>
      {actionBarComponent}
      {contentListComponent}
      {editFormComponent}
      {filterModalComponent}
      {messageDrawerComponent}
    </WrappedContainer>
  )
})

export default MessageManagement
