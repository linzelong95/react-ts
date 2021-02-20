import React, { memo, useCallback, useEffect, useState, useMemo } from 'react'
import { WrappedContainer } from '@common/components'
import { message, Table, Tabs, Button, Tag } from 'antd'
import { FormOutlined, UnlockOutlined, LockOutlined, DeleteOutlined } from '@ant-design/icons'
import moment from 'moment'
import { adminCategoryServices } from '@blog-admin/services/category'
import { adminSortServices } from '@blog-admin/services/sort'
import type { FC, ReactText } from 'react'
import type { RouteComponentProps } from 'react-router'
import type { Sort, Category } from '@blog-admin/types'
import type { TableProps } from 'antd/lib/table'

type DataSource = (Sort | Category)['getListRes']['list']
type WholeTableProps = TableProps<DataSource[number]>

const CategoryManagement: FC<RouteComponentProps> = memo(() => {
  const [total, setTotal] = useState<number>(0)
  const [selectedItems, setSelectedItems] = useState<DataSource>([])
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({ current: 1, pageSize: 10 })
  const [tabKey, setTabKey] = useState<'cate' | 'sort'>('sort')
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<DataSource>([])
  const [categoryOptions, setCategoryOptions] = useState<Category['getListRes']['list']>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filters, setFilters] = useState<Partial<{ sort: string; isEnable: boolean }>>({})

  const handleSelectRows = useCallback<WholeTableProps['rowSelection']['onChange']>(
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

  const handleTableChange = useCallback<WholeTableProps['onChange']>((pagination) => {
    setPagination({ current: pagination.current, pageSize: pagination.pageSize })
  }, [])

  const cateColumn = useMemo<TableProps<Category['listItem']>['columns']>(
    () => [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        width: '15%',
      },
      {
        title: '所属',
        dataIndex: 'sort',
        key: 'sort',
        sorter: true,
        width: '15%',
        filters: categoryOptions.map((categoryOption) => ({ text: categoryOption.name, value: categoryOption.id })),
        filteredValue: filters.sort ? [filters.sort] : [],
        render: (val) => val?.name,
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        sorter: true,
        width: '20%',
        render: (val) => moment(new Date(val)).format('YYYY-MM-DD'),
      },
      {
        title: '修改时间',
        dataIndex: 'updateDate',
        key: 'updateDate',
        sorter: true,
        width: '20%',
        render: (val) => moment(new Date(val)).format('YYYY-MM-DD'),
      },
      {
        title: '状态',
        dataIndex: 'isEnable',
        key: 'isEnable',
        width: '10%',
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
        width: '20%',
        render: (record: Category['listItem']) => (
          <>
            <Button
              icon={<FormOutlined />}
              size="small"
              shape="circle"
              // onClick={() => this.handleItems(AdminCateAPI.FORM, item)}
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
    ],
    [categoryOptions, filters],
  )
  const sortColumn = useMemo<TableProps<Sort['listItem']>['columns']>(
    () => [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        width: '20%',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        sorter: true,
        width: '20%',
        render: (val) => moment(new Date(val)).format('YYYY-MM-DD'),
      },
      {
        title: '修改时间',
        dataIndex: 'updateDate',
        key: 'updateDate',
        sorter: true,
        width: '20%',
        render: (val) => moment(new Date(val)).format('YYYY-MM-DD'),
      },
      {
        title: '状态',
        dataIndex: 'isEnable',
        key: 'isEnable',
        sorter: true,
        width: '20%',
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
        width: '20%',
        render: (record) => (
          <>
            <Button
              icon={<FormOutlined />}
              size="small"
              shape="circle"
              // onClick={() => this.handleItems(AdminSortAPI.FORM, item)}
              style={{ color: '#8B3A3A' }}
            />
            <Button
              icon={<DeleteOutlined />}
              size="small"
              shape="circle"
              // onClick={() => this.handleItems(AdminSortAPI.DELETE, item)}
              style={{ color: 'red', marginLeft: '10px' }}
            />
            {record.isEnable === 1 && (
              <Button
                icon={<LockOutlined />}
                size="small"
                shape="circle"
                // onClick={() => this.handleItems(AdminSortAPI.LOCK, item)}
                style={{ color: '#A020F0', marginLeft: '10px' }}
              />
            )}
            {record.isEnable === 0 && (
              <Button
                icon="unlock"
                size="small"
                shape="circle"
                // onClick={() => this.handleItems(AdminSortAPI.UNLOCK, item)}
                style={{ color: 'green', marginLeft: '10px' }}
              />
            )}
          </>
        ),
      },
    ],
    [filters],
  )

  const expandedRowRender = useCallback<TableProps<any>['expandedRowRender']>(
    (record) => {
      return (
        <Table
          columns={cateColumn.filter((item) => item.key !== 'sort').map((item) => ({ ...item, width: '20%', align: 'right' }))}
          rowKey="id"
          loading={loading}
          dataSource={record.categories}
          pagination={false}
          showHeader={false}
        />
      )
    },
    [cateColumn, loading],
  )

  useEffect(() => {
    setLoading(true)
    Promise.race(tabKey === 'sort' ? [adminSortServices.getList()] : [adminCategoryServices.getList()])
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
  }, [tabKey])

  useEffect(() => {
    ;(async () => {
      const [categoryRes] = await adminCategoryServices.getList({ index: 1, size: 999 })
      setCategoryOptions(categoryRes?.data?.list || [])
    })()
  }, [])

  return (
    <WrappedContainer>
      <Tabs
        activeKey={tabKey}
        onChange={(key) => {
          setTabKey(key as 'cate' | 'sort')
        }}
      >
        <Tabs.TabPane tab="一级分类" key="sort" />
        <Tabs.TabPane tab="二级分类" key="cate" />
      </Tabs>
      <Table
        columns={tabKey === 'cate' ? cateColumn : sortColumn}
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
    </WrappedContainer>
  )
})

export default CategoryManagement
