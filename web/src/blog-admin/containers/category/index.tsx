import React, { memo, useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { WrappedContainer } from '@common/components'
import { message, Table, Tabs, Button, Tag, Input, Row, Col, Tooltip, Badge } from 'antd'
import { UnlockOutlined, LockOutlined, DeleteOutlined, HomeOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons'
import moment from 'moment'
import { adminCategoryServices } from '@blog-admin/services/category'
import { adminSortServices } from '@blog-admin/services/sort'
import EditForm from './edit-form'
import type { FC, ReactNode } from 'react'
import type { RouteComponentProps } from 'react-router'
import type { Sort, Category } from '@blog-admin/types'
import type { TableProps } from 'antd/lib/table'
import type { SorterResult } from 'antd/lib/table/interface'
import type { TabsProps } from 'antd/lib/tabs'
import type { SearchProps } from 'antd/lib/input/Search'

export type ListItem = (Sort | Category)['listItemByAdminRole']
export type ToggleEditorialPanel = (editCateInSortPanel?: boolean, record?: ListItem) => void
export type SaveData = (params: (Sort | Category)['editParams']) => void
type TabKey = 'cate' | 'sort'
type GetColumns = <T = unknown>(type: TabKey, excludes?: string[]) => TableProps<T>['columns']
type HandleItems = (type: 'remove' | 'lock' | 'unlock', from?: TabKey, record?: ListItem) => void

const CategoryManagement: FC<RouteComponentProps> = memo(() => {
  const inputSearchRef = useRef<Input>(null)
  const [total, setTotal] = useState<number>(0)
  const [selectedItems, setSelectedItems] = useState<ListItem[]>([])
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({ current: 1, pageSize: 10 })
  const [tabKey, setTabKey] = useState<TabKey>('sort')
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<ListItem[]>([])
  const [allSortList, setAllSortList] = useState<Sort['getListResByAdminRole']['list']>([])
  const [conditionQuery, setConditionQuery] = useState<Partial<(Sort | Category)['getListParamsByAdminRole']['conditionQuery']>>({})
  const [filters, setFilters] = useState<Partial<{ sort: number[]; isEnable: number[] }>>({})
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [editFormType, setEditFormType] = useState<TabKey>('sort')
  const [editFormData, setEditFormData] = useState<ListItem>(null)

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

  const getAllSortList = useCallback<() => void>(async () => {
    const [sortRes] = await adminSortServices.getList({ index: 1, size: 999 })
    setAllSortList(sortRes?.data?.list || [])
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
    const sortIdsArr = filters?.sort as number[]
    setFilters(filters)
    setConditionQuery((prevValue) => ({ ...prevValue, orderBy, isEnable, sortIdsArr } as typeof conditionQuery))
  }, [])

  const changeTab = useCallback<TabsProps['onChange']>((key) => {
    setPagination((prevValue) => ({ ...prevValue, current: 1 }))
    setDataSource([])
    setSelectedItems([])
    setFilters({})
    setConditionQuery({})
    setTabKey(key as TabKey)
    setEditFormType(key as TabKey)
    inputSearchRef.current?.setValue?.('')
  }, [])

  const handleItems = useCallback<HandleItems>(
    async (type, from = tabKey, record) => {
      const handlingItems = (record ? [record] : selectedItems).map((item) => ({ id: item.id, name: item.name }))
      const specificServices = from === 'sort' ? adminSortServices : adminCategoryServices
      // const [, err] = await specificServices[type]({ items: handlingItems }) // 绕过ts检测，不推荐
      let service: typeof adminSortServices.remove
      switch (type) {
        case 'remove':
          service = specificServices.remove
          break
        case 'lock':
          service = specificServices.lock
          break
        case 'unlock':
          service = specificServices.unlock
          break
        default:
          break
      }
      const [, err] = await service({ items: handlingItems })
      if (err) {
        message.error('操作失败')
        return
      }
      message.success('操作成功')
      setPagination((prevValue) => ({ ...prevValue, current: 1 }))
      if (from === 'sort') getAllSortList()
    },
    [selectedItems, tabKey, getAllSortList],
  )

  const toggleEditorialPanel = useCallback<ToggleEditorialPanel>(
    (editCateInSortPanel, record) => {
      setEditFormData(record)
      setEditFormType(editCateInSortPanel ? 'cate' : tabKey)
      setEditFormVisible((prevValue) => !prevValue)
    },
    [tabKey],
  )

  const saveData = useCallback<SaveData>(
    (params) => {
      message.loading({ content: '正在提交...', key: 'saveData', duration: 0 })
      Promise.race(
        editFormType === 'sort'
          ? [adminSortServices.save(params as Sort['editParams'])]
          : [adminCategoryServices.save(params as Category['editParams'])],
      )
        .then(([, err]) => {
          if (err) throw err
          setPagination((prevValue) => ({ ...prevValue, current: 1 }))
          message.success({ content: '操作成功', key: 'saveData' })
          if (editFormType === 'sort') getAllSortList()
        })
        .catch((error) => {
          message.error({ content: error.message || '提交失败', key: 'saveData' })
        })
    },
    [editFormType, getAllSortList],
  )

  const getColumns = useCallback<GetColumns>(
    (type, excludes) => {
      return [
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          sorter: true,
        },
        type === 'cate' &&
          !excludes?.includes?.('sort') && {
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
                  toggleEditorialPanel(type !== tabKey, record)
                }}
              >
                编辑
              </Button>
              <Button
                size="small"
                danger
                type="primary"
                onClick={() => {
                  handleItems('remove', type, record)
                }}
                style={{ marginLeft: 10 }}
              >
                删除
              </Button>
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  handleItems(record.isEnable ? 'lock' : 'unlock', type, record)
                }}
                style={{ marginLeft: 10 }}
              >
                {record.isEnable ? '禁用' : '启用'}
              </Button>
            </>
          ),
        },
      ].filter(Boolean)
    },
    [tabKey, allSortList, filters, toggleEditorialPanel, handleItems],
  )

  useEffect(() => {
    setLoading(true)
    const params = { index: pagination.current, size: pagination.pageSize, conditionQuery }
    Promise.race(
      tabKey === 'sort'
        ? [adminSortServices.getList(params as Partial<Sort['getListParamsByAdminRole']>)]
        : [adminCategoryServices.getList(params as Partial<Category['getListParamsByAdminRole']>)],
    )
      .then(([res, err]) => {
        if (err) throw err
        setLoading(false)
        setTotal(res.data.total)
        setDataSource(res.data.list)
      })
      .catch((error) => {
        message.error(error.message || '获取分类失败')
      })
  }, [tabKey, conditionQuery, pagination])

  useEffect(() => {
    getAllSortList()
  }, [getAllSortList])

  const tabComponent = useMemo<ReactNode>(() => {
    return (
      <Tabs activeKey={tabKey} onChange={changeTab}>
        <Tabs.TabPane tab="一级分类" key="sort" />
        <Tabs.TabPane tab="二级分类" key="cate" />
      </Tabs>
    )
  }, [tabKey, changeTab])

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
          {tabKey === 'sort' && (
            <Button
              icon={<PlusOutlined />}
              type="primary"
              size="small"
              style={{ marginLeft: 10 }}
              onClick={() => {
                toggleEditorialPanel(true)
              }}
            >
              新增子分类
            </Button>
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
  }, [tabKey, selectedItems, toggleEditorialPanel, handleItems, handleSearch, showDataByDefaultWay])

  const contentTableComponent = useMemo<ReactNode>(() => {
    return (
      <Table<ListItem>
        columns={getColumns<ListItem>(tabKey)}
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
        expandable={
          tabKey === 'sort' && {
            expandedRowRender: (record: Sort['listItemByAdminRole']) => {
              const formativeDataSource = record?.categories?.map?.((category) => {
                return { ...category, sort: { ...record, categories: undefined } }
              })
              return (
                <Table<Category['listItemByAdminRole']>
                  columns={getColumns<Category['listItemByAdminRole']>('cate', ['sort'])}
                  rowKey="id"
                  loading={loading}
                  dataSource={formativeDataSource || []}
                  pagination={false}
                  showHeader={false}
                />
              )
            },
          }
        }
      />
    )
  }, [tabKey, total, selectedItems, loading, dataSource, pagination, getColumns, handleTableChange, handleSelectRows])

  const editFormComponent = useMemo<ReactNode>(() => {
    if (!editFormVisible) return null
    return (
      <EditForm
        type={editFormType}
        visible={editFormVisible}
        initialValues={editFormData}
        allSortList={allSortList.filter((sort) => Boolean(sort.isEnable))}
        onToggleEditorialPanel={toggleEditorialPanel}
        onSave={saveData}
      />
    )
  }, [editFormVisible, editFormType, editFormData, allSortList, toggleEditorialPanel, saveData])

  return (
    <WrappedContainer>
      {tabComponent}
      {actionBarComponent}
      {contentTableComponent}
      {editFormComponent}
    </WrappedContainer>
  )
})

export default CategoryManagement
