import React, { memo, useCallback, useState, useEffect, useMemo, useImperativeHandle, forwardRef } from 'react'
import { Modal, Button, Checkbox, Divider, Select, Radio, Badge, Alert, Tree, message } from 'antd'
import { useService } from '@common/hooks'
import { sortServices, articleServices } from '@b-blog/services'
import type { SetStateAction, Dispatch, ForwardRefRenderFunction } from 'react'
import type { ModalProps } from 'antd/lib/modal'
import type { SelectValue } from 'antd/lib/select'
import type { ConditionQuery } from '@b-blog/containers/reply'
import type { ISort, IArticle } from '@b-blog/types'

type FilterRequest = (type: 'ok' | 'exit' | 'clear') => void

interface FilterModalProps extends ModalProps {
  conditionQuery: ConditionQuery
  onSetFilterModalVisible: Dispatch<SetStateAction<boolean>>
  onSetConditionQuery: Dispatch<SetStateAction<ConditionQuery>>
}

export type TemporaryCondition = {
  commonFilterArr?: ['isTop'?, 'isApproved'?, 'isParent'?, 'isSon'?]
  filteredSortArr?: string[]
  articleArr?: { key: number; label: string }[]
  filterFlag?: boolean
}

export type FilterModalRef = { clear: () => void }

const FilterModal: ForwardRefRenderFunction<FilterModalRef, FilterModalProps> = (props, ref) => {
  const { visible, conditionQuery, onSetFilterModalVisible, onSetConditionQuery } = props

  const [filterType, setFilterType] = useState<'catalog' | 'article'>('catalog')
  const [allSortList, setAllSortList] = useState<ISort['getListRes']['list']>([])
  const [temporaryCondition, setTemporaryCondition] = useState<TemporaryCondition>({})
  const [articleSearch, setArticleSearch] = useState<string>(undefined)

  const getListParams = useMemo<IArticle['getListParams']>(
    () => ({
      index: 1,
      size: 10,
      conditionQuery: { title: articleSearch?.trim() },
    }),
    [articleSearch],
  )
  const [articleLoading, articleRes, articleErr] = useService(articleServices.getList, getListParams)
  const articleList = useMemo(() => {
    if (articleErr) {
      message.error(articleErr.message || '获取列表失败')
      return []
    }
    return articleRes?.data?.list || []
  }, [articleRes, articleErr])

  useImperativeHandle(
    ref,
    () => ({
      clear: () => setTemporaryCondition({}),
    }),
    [],
  )

  const filterRequest = useCallback<FilterRequest>(
    (type) => {
      if (type === 'clear') {
        setTemporaryCondition({})
        return
      }
      onSetFilterModalVisible((prevValue) => !prevValue)
      if (type === 'exit') {
        setTemporaryCondition((prevValue) => ({
          ...prevValue,
          commonFilterArr: conditionQuery?.commonFilterArr || [],
          filteredSortArr: conditionQuery?.filteredSortArr || [],
          articleArr: conditionQuery?.articleArr || [],
        }))
        return
      }
      const { filteredSortArr = [], articleArr = [], commonFilterArr = [] } = temporaryCondition
      const isApproved = commonFilterArr.includes?.('isApproved') ? 0 : undefined
      const isTop = commonFilterArr.includes?.('isTop') ? 1 : undefined
      const isRoot = (() => {
        if (commonFilterArr.includes('isParent') && !commonFilterArr.includes('isSon')) return 1
        if (!commonFilterArr.includes('isParent') && commonFilterArr.includes('isSon')) return 0
        return undefined
      })()
      const articleIdsArr = articleArr.map((article) => article.key)
      const category = { sortIdsArr: [], cateIdsArr: [] }
      filteredSortArr.forEach((item) => {
        const arr = item.split('-')
        if (arr.length === 1) {
          category.sortIdsArr.push(Number(arr[0]))
        } else if (!category.sortIdsArr.includes(Number(arr[0]))) {
          category.cateIdsArr.push(Number(arr.pop()))
        }
      })
      onSetConditionQuery((oldValue) => ({
        ...oldValue,
        isApproved,
        isTop,
        isRoot,
        commonFilterArr,
        filteredSortArr,
        articleArr,
        articleIdsArr,
        category,
      }))
    },
    [conditionQuery, temporaryCondition, onSetFilterModalVisible, onSetConditionQuery],
  )

  useEffect(() => {
    ;(async () => {
      const [sortRes] = await sortServices.getList({ index: 1, size: 999 })
      setAllSortList(sortRes?.data?.list || [])
    })()
  }, [])

  return (
    <Modal
      destroyOnClose
      visible={visible}
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
      <Divider />
      <div style={{ textAlign: 'center' }}>
        <Radio.Group size="small" value={filterType} buttonStyle="solid" onChange={({ target }) => setFilterType(target.value)}>
          <Radio.Button value="catalog">
            <Badge dot={temporaryCondition?.filteredSortArr?.length > 0}>
              <span style={{ marginLeft: 10, marginRight: 10 }}>按分类</span>
            </Badge>
          </Radio.Button>
          <Radio.Button value="article">
            <Badge dot={temporaryCondition?.articleArr?.length > 0}>
              <span style={{ marginLeft: 10, marginRight: 10 }}>按文章</span>
            </Badge>
          </Radio.Button>
        </Radio.Group>
      </div>
      <Alert message="筛选分两种类别，请注意您是否需要同时进行两种类别的筛选！" type="warning" showIcon style={{ margin: '15px 0px' }} />
      {filterType === 'catalog' && (
        <Tree
          checkable
          showLine
          onCheck={(value) => setTemporaryCondition((prevValue) => ({ ...prevValue, filteredSortArr: (value as unknown) as string[] }))}
          expandedKeys={temporaryCondition?.filteredSortArr || []}
          checkedKeys={temporaryCondition?.filteredSortArr || []}
        >
          {allSortList.map((item) => (
            <Tree.TreeNode title={item.name} key={`${item.id}`} selectable={false} disabled={item.isEnable === 0}>
              {item.categories.map((category) => (
                <Tree.TreeNode
                  title={category.name}
                  key={`${item.id}-${category.id}`}
                  selectable={false}
                  disabled={item.isEnable === 1 ? category.isEnable === 0 : true}
                />
              ))}
            </Tree.TreeNode>
          ))}
        </Tree>
      )}
      {filterType === 'article' && (
        <div style={{ textAlign: 'center' }}>
          <span>文章：</span>
          <Select
            labelInValue
            showSearch
            mode="multiple"
            notFoundContent={null}
            loading={articleLoading}
            filterOption={false}
            onChange={(value) =>
              setTemporaryCondition((prevValue) => ({ ...prevValue, articleArr: (value as unknown) as TemporaryCondition['articleArr'] }))
            }
            onSearch={setArticleSearch}
            value={(temporaryCondition.articleArr as unknown) as SelectValue}
            style={{ width: 350 }}
          >
            {articleList.map((article) => (
              <Select.Option value={article.id} key={article.id}>
                {article.title}
              </Select.Option>
            ))}
          </Select>
        </div>
      )}
    </Modal>
  )
}

export default memo(forwardRef(FilterModal))
