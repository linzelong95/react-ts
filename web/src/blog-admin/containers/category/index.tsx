import React, { memo, useCallback, useEffect, useState, useRef } from 'react'
import { WrappedContainer } from '@common/components'
import { message, Table, Tabs, Button, Tag, Input, Row, Col, Tooltip } from 'antd'
import { FormOutlined, UnlockOutlined, LockOutlined, DeleteOutlined, HomeOutlined } from '@ant-design/icons'
import moment from 'moment'
import { adminCategoryServices } from '@blog-admin/services/category'
import { adminSortServices } from '@blog-admin/services/sort'
import CategoryForm from './category-form'
import type { FC, ReactText } from 'react'
import type { RouteComponentProps } from 'react-router'
import type { Sort, Category } from '@blog-admin/types'
import type { TableProps } from 'antd/lib/table'
import type { TabsProps } from 'antd/lib/tabs'

export type ListItem = (Sort | Category)['listItemByAdminRole']
export type ToggleEditorialPanel = (editCateInSortPanel?: boolean, record?: ListItem) => void
export type SaveData = (params: (Sort | Category)['insertParams']) => void
type TabKey = 'cate' | 'sort'
type GetColumns = <T = unknown>(type: TabKey, excludes?: string[]) => TableProps<T>['columns']

const CategoryManagement: FC<RouteComponentProps> = memo(() => {
  const inputSearchRef = useRef<Input>(null)
  const [total, setTotal] = useState<number>(0)
  const [selectedItems, setSelectedItems] = useState<ListItem[]>([])
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({ current: 1, pageSize: 10 })
  const [tabKey, setTabKey] = useState<TabKey>('sort')
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<ListItem[]>([])
  const [allSortList, setAllSortList] = useState<Sort['getListResByAdminRole']['list']>([])
  const [conditionQuery, setConditionQuery] = useState<Partial<(Sort | Category)['getListParamsByAdminRole']>>({})
  const [filters, setFilters] = useState<Partial<{ sort: string; isEnable: boolean }>>({})
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [editFormType, setEditFormType] = useState<TabKey>('sort')
  const [editFormData, setEditFormData] = useState<ListItem>(null)

  const showDataByDefaultWay = useCallback<(event: React.MouseEvent<HTMLElement, MouseEvent>) => void>(() => {
    setConditionQuery({})
    setFilters({})
    inputSearchRef.current?.setValue?.('')
    setPagination((prevValue) => ({ ...prevValue, current: 1 }))
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

  const handleTableChange = useCallback<TableProps<ListItem>['onChange']>((pagination) => {
    setPagination({ current: pagination.current, pageSize: pagination.pageSize })
  }, [])

  const changeTab = useCallback<TabsProps['onChange']>((key) => {
    setDataSource([])
    setSelectedItems([])
    setFilters({})
    setConditionQuery({})
    setTabKey(key as TabKey)
    setEditFormType(key as TabKey)
    inputSearchRef.current?.setValue?.('')
  }, [])

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
        tabKey === 'sort'
          ? [adminSortServices.insert(params as Sort['insertParams'])]
          : [adminCategoryServices.insert(params as Category['insertParams'])],
      )
        .then(([, err]) => {
          if (err) throw err
          message.success({ content: '操作成功', key: 'saveData' })
        })
        .catch((error) => {
          message.error({ content: error.message || '提交失败', key: 'saveData' })
        })
    },
    [tabKey],
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
            filteredValue: filters.sort ? [filters.sort] : [],
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
          filteredValue: filters.isEnable !== undefined ? [(filters.isEnable as unknown) as ReactText] : [],
          render: (val) => <Tag color={val === 1 ? 'blue' : 'gray'}>{val === 1 ? '可用' : '不可用'}</Tag>,
        },
        {
          title: '操作',
          key: 'action',
          render: (record) => (
            <>
              <Button
                icon={<FormOutlined />}
                size="small"
                shape="circle"
                onClick={() => toggleEditorialPanel(undefined, record)}
                style={{ color: '#8B3A3A' }}
              />
              <Button
                icon={<DeleteOutlined />}
                size="small"
                shape="circle"
                // onClick={() => this.handleItems(AdminCateAPI.DELETE, item)}
                style={{ color: 'red', marginLeft: '10px' }}
              />
              {record.isEnable === 1 && (
                <Button
                  icon={<LockOutlined />}
                  size="small"
                  shape="circle"
                  // onClick={() => this.handleItems(AdminCateAPI.LOCK, item)}
                  style={{ color: '#A020F0', marginLeft: '10px' }}
                />
              )}
              {record.isEnable === 0 && (
                <Button
                  icon={<UnlockOutlined />}
                  size="small"
                  shape="circle"
                  // onClick={() => this.handleItems(AdminCateAPI.UNLOCK, item)}
                  style={{ color: 'green', marginLeft: '10px' }}
                />
              )}
            </>
          ),
        },
      ].filter(Boolean)
    },
    [allSortList, filters, toggleEditorialPanel],
  )

  const expandedRowRender = useCallback<TableProps<any>['expandedRowRender']>(
    (record) => {
      return (
        <Table
          columns={getColumns<Category['listItemByAdminRole']>('cate')}
          rowKey="id"
          loading={loading}
          dataSource={record.categories}
          pagination={false}
          showHeader={false}
        />
      )
    },
    [getColumns, loading],
  )

  useEffect(() => {
    setLoading(true)
    Promise.race(
      tabKey === 'sort'
        ? [adminSortServices.getList(conditionQuery as Partial<Sort['getListParamsByAdminRole']>)]
        : [adminCategoryServices.getList(conditionQuery as Partial<Category['getListParamsByAdminRole']>)],
    )
      .then(([res, err]) => {
        if (err) throw err
        setLoading(false)
        setSelectedItems([])
        setTotal(res.data.total)
        setDataSource(res.data.list)
      })
      .catch((error) => {
        message.error(error.message || '获取分类失败')
      })
  }, [tabKey, conditionQuery])

  useEffect(() => {
    ;(async () => {
      const [sortRes] = await adminSortServices.getList({ index: 1, size: 999 })
      setAllSortList(sortRes?.data?.list || [])
    })()
  }, [])

  return (
    <WrappedContainer>
      <Tabs activeKey={tabKey} onChange={changeTab}>
        <Tabs.TabPane tab="一级分类" key="sort" />
        <Tabs.TabPane tab="二级分类" key="cate" />
      </Tabs>
      <Row align="middle" style={{ marginBottom: '15px' }}>
        <Col xs={12} sm={13} md={15} lg={16} xl={17}>
          <Button type="primary" size="small" onClick={() => toggleEditorialPanel()}>
            新增
          </Button>
          {tabKey === 'sort' && (
            <Button type="primary" size="small" style={{ marginLeft: 10 }} onClick={() => toggleEditorialPanel(true)}>
              新增子分类
            </Button>
          )}
        </Col>
        <Col xs={2} sm={2} md={1} lg={1} xl={1}>
          <Tooltip title="默认展示">
            <Button type="primary" icon={<HomeOutlined />} shape="circle" size="small" onClick={showDataByDefaultWay} />
          </Tooltip>
        </Col>
        <Col xs={10} sm={9} md={8} lg={7} xl={6}>
          <Input.Search
            ref={inputSearchRef}
            placeholder="Enter something"
            onSearch={(value) => {
              setConditionQuery((prevValue) => ({ ...prevValue, name: value.trim() }))
            }}
            enterButton
            allowClear
          />
        </Col>
      </Row>
      <Table
        columns={getColumns<(Category | Sort)['listItemByAdminRole']>(tabKey)}
        rowKey={(item) => item.id}
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
        expandable={tabKey === 'sort' && { expandedRowRender }}
      />
      <CategoryForm
        type={editFormType}
        visible={editFormVisible}
        initialValues={editFormData}
        allSortList={allSortList.filter((sort) => Boolean(sort.isEnable))}
        onToggleEditorialPanel={toggleEditorialPanel}
        onSave={saveData}
      />
    </WrappedContainer>
  )
})

export default CategoryManagement
