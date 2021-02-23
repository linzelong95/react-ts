import React, { memo, useMemo, useState, useCallback, useRef, useEffect } from 'react'
import { WrappedContainer } from '@common/components'
import { message, Row, Col, Button, List, Checkbox, Avatar, Tag, Input, Tooltip, Badge } from 'antd'
import {
  UnlockOutlined,
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
} from '@ant-design/icons'
import EditForm from './edit-form'
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

export type SaveData = (params: any) => void
type HandleItems = (type: 'remove' | 'reply' | 'approval' | 'disapproval' | 'top' | 'unTop', record?: any) => void

const MessageManagement: FC<RouteComponentProps> = memo(() => {
  const inputSearchRef = useRef<Input>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({ current: 1, pageSize: 10 })
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [editFormData, setEditFormData] = useState<any>(null)
  const [dataSource, setDataSource] = useState<Message['listItemByAdminRole'][]>([])
  const [selectedItems, setSelectedItems] = useState<Message['listItemByAdminRole'][]>([])
  const [temporaryCondition, setTemporaryCondition] = useState<any>({})
  const [allSelectedFlag, setAllSelectedFlag] = useState<boolean>(false)
  const [conditionQuery, setConditionQuery] = useState<Message['getListParamsByAdminRole']['conditionQuery']>({})
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false)
  const [showSorterFlag, setShowSorterFlag] = useState<boolean>(false)

  console.log(filterModalVisible)

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

  const toggleEditorialPanel = useCallback<(record?: any) => void>((record) => {
    setEditFormData(record)
    setEditFormVisible((prevValue) => !prevValue)
  }, [])

  const saveData = useCallback<SaveData>((params) => {
    console.log(params)
    message.loading({ content: '正在提交...', key: 'saveData', duration: 0 })
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

  const toggleSelectOne = useCallback(
    (record) => {
      const newSelectedItems = selectedItems.some((selectedItem) => selectedItem.id === record.id)
        ? selectedItems.filter((selectedItem) => selectedItem.id !== record.id)
        : [...selectedItems, record]
      setSelectedItems(newSelectedItems)
      setAllSelectedFlag(
        !dataSource.length
          ? false
          : dataSource.every((listItem) => newSelectedItems.some((selectedItem) => selectedItem.id === listItem.id)),
      )
    },
    [selectedItems, dataSource],
  )

  const toggleShowSorter = useCallback<() => void>(() => {
    if (!dataSource?.length) return
    setShowSorterFlag((prevValue) => !prevValue)
  }, [dataSource])

  const sort = useCallback<TagProps['onClick']>(
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
          by: prevValue.orderBy.by === 'ASC' ? 'DESC' : 'ASC',
        } as Message['getListParamsByAdminRole']['conditionQuery']['orderBy'],
      }))
      setPagination((prevValue) => ({ ...prevValue, current: 1 }))
    },
    [toggleShowSorter],
  )

  const pageChange = useCallback<PaginationProps['onChange']>((current, pageSize) => {
    setPagination({ current, pageSize })
  }, [])

  const handleItems = useCallback<HandleItems>(
    async (type, record) => {
      const handlingItems = (record ? [record] : selectedItems).map((item) => ({ id: item.id, name: item.name }))
      const [, err] = await adminMessageServices[type]({ items: handlingItems })
      if (err) {
        message.error('操作失败')
        return
      }
      message.success('操作成功')
      setPagination((prevValue) => ({ ...prevValue, current: 1 }))
    },
    [selectedItems],
  )

  useEffect(() => {
    setLoading(true)
    const params = { index: pagination.current, size: pagination.pageSize, conditionQuery }
    ;(async () => {
      const [messageRes, messageErr] = await adminMessageServices.getList(params)
      if (messageErr || !Array.isArray(messageRes?.data?.list)) {
        message.error(messageErr.message || '获取列表失败')
        return
      }
      setLoading(false)
      setSelectedItems([])
      setTotal(messageRes.data.total)
      setDataSource(messageRes.data.list)
    })()
  }, [pagination, conditionQuery])

  const actionBarComponent = useMemo<ReactNode>(() => {
    return (
      <Row align="middle" style={{ marginBottom: '15px' }}>
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
            icon="filter"
            type={temporaryCondition.filterflag ? undefined : 'primary'}
            danger={temporaryCondition.filterflag}
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
            type={allSelectedFlag ? undefined : 'primary'}
            danger={allSelectedFlag}
            size="small"
            onClick={toggleSelectAll}
            style={{ marginLeft: 10 }}
          >
            {allSelectedFlag ? '反选' : '全选'}
            &nbsp;
          </Button>
          <Button
            icon={showSorterFlag ? 'right-circle-o' : 'left-circle-o'}
            type="primary"
            size="small"
            onClick={toggleShowSorter}
            style={{ marginLeft: 20 }}
          >
            排序
          </Button>
          {showSorterFlag && (
            <>
              <Tag color="magenta" id="default" style={{ marginLeft: 10 }} onClick={sort}>
                默认
              </Tag>
              <Tag color="magenta" id="createDate" style={{ marginLeft: 5 }} onClick={sort}>
                时间
                {conditionQuery?.orderBy?.name === 'createDate' && conditionQuery?.orderBy?.by === 'DESC' ? (
                  <CaretDownOutlined />
                ) : (
                  <CaretUpOutlined />
                )}
              </Tag>
              <Tag color="magenta" id="isApproved" style={{ marginLeft: 5 }} onClick={sort}>
                显示
                {conditionQuery?.orderBy?.name === 'isApproved' && conditionQuery?.orderBy?.by === 'DESC' ? (
                  <CaretDownOutlined />
                ) : (
                  <CaretUpOutlined />
                )}
              </Tag>
              <Tag color="magenta" id="isTop" style={{ marginLeft: 5 }} onClick={sort}>
                置顶
                {conditionQuery?.orderBy?.name === 'isTop' && conditionQuery?.orderBy?.by === 'DESC' ? (
                  <CaretDownOutlined />
                ) : (
                  <CaretUpOutlined />
                )}
              </Tag>
            </>
          )}
          {selectedItems.length > 0 && (
            <>
              <Badge count={selectedItems.length} title="已选项数">
                <Button
                  icon={<ReloadOutlined />}
                  type="primary"
                  size="small"
                  onClick={() => {
                    setSelectedItems([])
                  }}
                  style={{ marginLeft: 10 }}
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
                icon={<UnlockOutlined />}
                type="primary"
                size="small"
                onClick={() => {
                  handleItems('reply')
                }}
                style={{ marginLeft: 10 }}
              >
                回复
              </Button>
              <Button
                icon={<EyeOutlined />}
                type="primary"
                size="small"
                onClick={() => {
                  handleItems('approval')
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
                  handleItems('disapproval')
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
        <Col xs={2} sm={2} md={1} lg={1} xl={1}>
          <Tooltip title="默认展示">
            <Button type="primary" icon={<HomeOutlined />} shape="circle" size="small" onClick={showDataByDefaultWay} />
          </Tooltip>
        </Col>
        <Col xs={10} sm={9} md={8} lg={7} xl={6}>
          <Input.Search ref={inputSearchRef} placeholder="Enter something" onSearch={handleSearch} enterButton allowClear />
        </Col>
      </Row>
    )
  }, [
    showSorterFlag,
    conditionQuery,
    temporaryCondition,
    selectedItems,
    allSelectedFlag,
    toggleEditorialPanel,
    toggleSelectAll,
    handleItems,
    showDataByDefaultWay,
    handleSearch,
    toggleShowSorter,
    sort,
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
                  handleItems('reply', item)
                }}
              >
                回复
              </Button>,
              <Button
                key="ifPass"
                size="small"
                type="primary"
                onClick={() => {
                  handleItems(item.isApproved ? 'disapproval' : 'approval', item)
                }}
              >
                {item.isApproved ? '隐藏' : '过审'}
              </Button>,
              <Button
                key="isTo["
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
                    style={{ marginLeft: 20, marginTop: 10 }}
                  />
                  <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png" />
                </>
              }
              title={
                <span>
                  <span style={{ color: 'green', fontWeight: 'bold' }}>
                    <i>{item.from ? item.from.nickName : `${item.fromMail} [游客]`}&nbsp;</i>
                  </span>
                  的留言
                  {item.parentId > 0 && (
                    <span>
                      ( 回复&nbsp;
                      <i style={{ color: '#A0522D', fontWeight: 'bold' }}>{item.to ? item.to.nickName : `${item.toMail} [游客]`}</i>
                      &nbsp; )
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
  }, [loading, dataSource, total, pagination, allSelectedFlag, selectedItems, pageChange, toggleSelectOne, handleItems])

  const editFormComponent = useMemo<ReactNode>(() => {
    if (!editFormVisible) return null
    return (
      <EditForm visible={editFormVisible} initialValues={editFormData} onToggleEditorialPanel={toggleEditorialPanel} onSave={saveData} />
    )
  }, [editFormVisible, editFormData, toggleEditorialPanel, saveData])
  return (
    <WrappedContainer>
      {actionBarComponent}
      {contentListComponent}
      {editFormComponent}
    </WrappedContainer>
  )
})

export default MessageManagement
