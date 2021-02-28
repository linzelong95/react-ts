import React, { memo, useCallback, useState, useRef, useMemo, useEffect } from 'react'
import { WrappedContainer } from '@common/components'
import { useService } from '@common/hooks'
import { message, Table, Button, Tag, Input, Row, Col, Tooltip, Badge } from 'antd'
import { UnlockOutlined, LockOutlined, DeleteOutlined, HomeOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons'
import moment from 'moment'
import { adminSortServices } from '@blog-admin/services/sort'
import { adminTagServices } from '@blog-admin/services/tag'
import EditForm from '@blog-admin/components/tag/edit-form'
import type { FC, ReactNode } from 'react'
import type { RouteComponentProps } from 'react-router'
import type { TagTypeCollection, Sort } from '@blog-admin/types'
import type { TableProps } from 'antd/lib/table'
import type { SorterResult } from 'antd/lib/table/interface'
import type { SearchProps } from 'antd/lib/input/Search'

export type ListItem = TagTypeCollection['listItemByAdminRole']
export type ToggleEditorialPanel = (record?: ListItem) => void
export type SaveData = (params: TagTypeCollection['editParams'], callback?: () => void) => void
type HandleItems = (type: 'remove' | 'lock' | 'unlock', record?: ListItem) => void

const TagManagement: FC<RouteComponentProps> = memo(() => {
  const inputSearchRef = useRef<Input>(null)
  const [selectedItems, setSelectedItems] = useState<ListItem[]>([])
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({ current: 1, pageSize: 10 })
  const [allSortList, setAllSortList] = useState<Sort['getListResByAdminRole']['list']>([])
  const [conditionQuery, setConditionQuery] = useState<TagTypeCollection['getListParamsByAdminRole']['conditionQuery']>({})
  const [filters, setFilters] = useState<Partial<{ sort: number[]; isEnable: number[] }>>({})
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [editFormData, setEditFormData] = useState<ListItem>(null)
  const getListParams = useMemo<TagTypeCollection['getListParamsByAdminRole']>(
    () => ({
      index: pagination.current,
      size: pagination.pageSize,
      conditionQuery,
    }),
    [pagination, conditionQuery],
  )

  const [loading, messageRes, messageErr, forceRequest] = useService(adminTagServices.getList, getListParams)
  const [total, dataSource] = useMemo(() => {
    if (messageErr) {
      message.error(messageErr.message || '获取列表失败')
      return [0, []]
    }
    return [messageRes?.data?.total || 0, messageRes?.data?.list || []]
  }, [messageRes, messageErr])

  const showDataByDefaultWay = useCallback<(event: React.MouseEvent<HTMLElement, MouseEvent>) => void>(() => {
    setConditionQuery({})
    setFilters({})
    inputSearchRef.current?.setValue?.('')
    setPagination((prevValue) => ({ ...prevValue, current: 1 }))
  }, [])

  const handleSearch = useCallback<SearchProps['onSearch']>((value) => {
    setPagination((prevValue) => ({ ...prevValue, current: 1 }))
    setConditionQuery((prevValue) => ({ ...prevValue, name: value.trim() }))
  }, [])

  const handleSelectRows = useCallback<TableProps<ListItem>['rowSelection']['onChange']>(
    (keys, items) => {
      let newItems = []
      if (selectedItems.length === keys.length) {
        newItems = items
      } else if (selectedItems.length < keys.length) {
        newItems = [...selectedItems.filter((selectedItem) => items.every((item) => selectedItem.id !== item.id)), ...items]
      } else {
        newItems = selectedItems.filter((selectedItem) => keys.some((key) => key === selectedItem.id))
      }
      setSelectedItems(newItems)
    },
    [selectedItems],
  )

  const handleTableChange = useCallback<TableProps<ListItem>['onChange']>((pagination, filters, sorter) => {
    setPagination({ current: pagination.current, pageSize: pagination.pageSize })
    const { columnKey, order } = sorter as SorterResult<ListItem>
    const orderBy = order ? { name: columnKey, by: order === 'descend' ? 'DESC' : 'ASC' } : {}
    const isEnable = filters?.isEnable?.[0] as 0 | 1
    const sortIdsArr = (filters?.sort as number[]) || []
    setFilters(filters)
    setConditionQuery((prevValue) => ({ ...prevValue, orderBy, isEnable, sortIdsArr } as typeof conditionQuery))
  }, [])

  const handleItems = useCallback<HandleItems>(
    async (type, record) => {
      const handlingItems = (record ? [record] : selectedItems).map((item) => ({ id: item.id, name: item.name }))
      const [, err] = await adminTagServices[type]({ items: handlingItems })
      if (err) {
        message.error('操作失败')
        return
      }
      message.success('操作成功')
      setSelectedItems([])
      const { current } = pagination
      if (type === 'remove' && handlingItems?.length > dataSource?.length) {
        setPagination((prevValue) => ({ ...prevValue, current: current - 1 || 0 }))
      } else {
        forceRequest()
      }
    },
    [pagination, selectedItems, dataSource, forceRequest],
  )

  const toggleEditorialPanel = useCallback<ToggleEditorialPanel>((record) => {
    setEditFormData(record)
    setEditFormVisible((prevValue) => !prevValue)
  }, [])

  const saveData = useCallback<SaveData>(
    async (params, callback) => {
      message.loading({ content: '正在提交...', key: 'saveData', duration: 0 })
      const [, saveErr] = await adminTagServices.save(params)
      if (saveErr) {
        message.error({ content: saveErr.message || '提交失败', key: 'saveData' })
        return
      }
      if (callback) callback()
      const { pageSize, current } = pagination
      if (!params.id && dataSource?.length === pageSize) {
        setPagination((prevValue) => ({ ...prevValue, current: current + 1 }))
      } else {
        forceRequest()
      }
      message.success({ content: '操作成功', key: 'saveData' })
    },
    [dataSource, pagination, forceRequest],
  )

  useEffect(() => {
    ;(async () => {
      const [sortRes] = await adminSortServices.getList({ index: 1, size: 999 })
      setAllSortList(sortRes?.data?.list || [])
    })()
  }, [])

  const actionBarComponent = useMemo<ReactNode>(() => {
    return (
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
                  handleItems('unlock')
                }}
                style={{ marginLeft: 10 }}
              >
                启用
              </Button>
              <Button
                icon={<LockOutlined />}
                type="primary"
                size="small"
                onClick={() => {
                  handleItems('lock')
                }}
                style={{ marginLeft: 10 }}
              >
                禁用
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
  }, [selectedItems, toggleEditorialPanel, handleItems, handleSearch, showDataByDefaultWay])

  const contentTableComponent = useMemo<ReactNode>(() => {
    return (
      <Table<ListItem>
        columns={[
          {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
          },
          {
            title: '所属',
            dataIndex: 'sort',
            key: 'sort',
            sorter: true,
            filters: allSortList.map((sort) => ({ text: sort.name, value: sort.id })),
            filteredValue: filters?.sort || [],
            render: (val) => val?.name,
          },
          {
            title: '创建时间',
            dataIndex: 'createDate',
            key: 'createDate',
            sorter: true,
            render: (val) => moment(new Date(val)).format('YYYY-MM-DD'),
          },
          {
            title: '修改时间',
            dataIndex: 'updateDate',
            key: 'updateDate',
            sorter: true,
            render: (val) => moment(new Date(val)).format('YYYY-MM-DD'),
          },
          {
            title: '状态',
            dataIndex: 'isEnable',
            key: 'isEnable',
            sorter: true,
            filters: [
              { text: '不可用', value: 0 },
              { text: '可用', value: 1 },
            ],
            filterMultiple: false,
            filteredValue: filters?.isEnable || [],
            render: (val) => <Tag color={val === 1 ? 'blue' : 'gray'}>{val === 1 ? '可用' : '不可用'}</Tag>,
          },
          {
            title: '操作',
            key: 'action',
            render: (record) => (
              <>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    toggleEditorialPanel(record)
                  }}
                >
                  编辑
                </Button>
                <Button
                  size="small"
                  danger
                  type="primary"
                  onClick={() => {
                    handleItems('remove', record)
                  }}
                  style={{ marginLeft: 10 }}
                >
                  删除
                </Button>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    handleItems(record.isEnable ? 'lock' : 'unlock', record)
                  }}
                  style={{ marginLeft: 10 }}
                >
                  {record.isEnable ? '禁用' : '启用'}
                </Button>
              </>
            ),
          },
        ]}
        rowKey="id"
        onChange={handleTableChange}
        rowSelection={{ selectedRowKeys: selectedItems.map((item) => item.id), onChange: handleSelectRows }}
        loading={loading}
        dataSource={dataSource}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          total,
          ...pagination,
        }}
      />
    )
  }, [
    total,
    allSortList,
    filters,
    selectedItems,
    loading,
    dataSource,
    pagination,
    handleTableChange,
    handleSelectRows,
    handleItems,
    toggleEditorialPanel,
  ])

  const editFormComponent = useMemo<ReactNode>(() => {
    if (!editFormVisible) return null
    return (
      <EditForm
        visible={editFormVisible}
        initialValues={editFormData}
        allSortList={allSortList.filter((sort) => Boolean(sort.isEnable))}
        onSave={saveData}
        onToggleEditorialPanel={toggleEditorialPanel}
      />
    )
  }, [editFormVisible, editFormData, allSortList, toggleEditorialPanel, saveData])

  return (
    <WrappedContainer>
      {actionBarComponent}
      {contentTableComponent}
      {editFormComponent}
    </WrappedContainer>
  )
})

export default TagManagement
