import React, {
  memo,
  useCallback,
  useState,
  useEffect,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { Modal, Button, Row, Col, Tag, Radio, Badge, Alert, Tree, message } from 'antd'
import { useService } from '@common/hooks'
import { tagServices, sortServices } from '@b-blog/services'
import type { SetStateAction, Dispatch, ForwardRefRenderFunction } from 'react'
import type { ModalProps } from 'antd/lib/modal'
import type { ConditionQuery } from '@b-blog/containers/article'
import type { ISort, ITag } from '@b-blog/types'

type FilterRequest = (type: 'ok' | 'exit' | 'clear') => void

interface FilterModalProps extends ModalProps {
  conditionQuery: ConditionQuery
  onSetFilterModalVisible: Dispatch<SetStateAction<boolean>>
  onSetConditionQuery: Dispatch<SetStateAction<ConditionQuery>>
}

export type TemporaryCondition = {
  filteredSortArr?: string[]
  tagIdsArr?: number[]
  filterFlag?: boolean
}

export type FilterModalRef = { clear: () => void }

const FilterModal: ForwardRefRenderFunction<FilterModalRef, FilterModalProps> = (props, ref) => {
  const { visible, conditionQuery, onSetFilterModalVisible, onSetConditionQuery } = props

  const [filterType, setFilterType] = useState<'catalog' | 'tag'>('catalog')
  const [allSortList, setAllSortList] = useState<ISort['getListRes']['list']>([])
  const [temporaryCondition, setTemporaryCondition] = useState<TemporaryCondition>({})

  const getListParams = useMemo<ITag['getListParams']>(
    () => ({
      index: 1,
      size: 999,
      conditionQuery: {},
    }),
    [],
  )

  const [, tagRes, tagErr] = useService(tagServices.getList, getListParams)
  const tagList = useMemo(() => {
    if (tagErr) {
      message.error(tagErr.message || '获取列表失败')
      return []
    }
    return tagRes?.data?.list || []
  }, [tagRes, tagErr])

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
          filteredSortArr: conditionQuery?.filteredSortArr || [],
          tagIdsArr: conditionQuery?.tagIdsArr || [],
        }))
        return
      }
      const { filteredSortArr = [], tagIdsArr = [] } = temporaryCondition
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
        filteredSortArr,
        tagIdsArr,
        category,
      }))
    },
    [conditionQuery, temporaryCondition, onSetFilterModalVisible, onSetConditionQuery],
  )

  const handleTagSelect = useCallback((id, checked) => {
    setTemporaryCondition((prevValue) => {
      const { tagIdsArr = [] } = prevValue
      const newTagIds = checked ? [...tagIdsArr, id] : tagIdsArr.filter((tagId) => tagId !== id)
      return { ...prevValue, tagIdsArr: newTagIds }
    })
  }, [])

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
        <Radio.Group
          size="small"
          value={filterType}
          buttonStyle="solid"
          onChange={({ target }) => setFilterType(target.value)}
        >
          <Radio.Button value="catalog">
            <Badge dot={temporaryCondition?.filteredSortArr?.length > 0}>
              <span style={{ marginLeft: 10, marginRight: 10 }}>按分类</span>
            </Badge>
          </Radio.Button>
          <Radio.Button value="tag">
            <Badge dot={temporaryCondition?.tagIdsArr?.length > 0}>
              <span style={{ marginLeft: 10, marginRight: 10 }}>按标签</span>
            </Badge>
          </Radio.Button>
        </Radio.Group>
      </div>
      <Alert
        message="筛选分两种类别，请注意您是否需要同时进行两种类别的筛选！"
        type="warning"
        showIcon
        style={{ margin: '15px 0px' }}
      />
      {filterType === 'catalog' && (
        <Tree
          checkable
          showLine
          onCheck={(value) =>
            setTemporaryCondition((prevValue) => ({
              ...prevValue,
              filteredSortArr: (value as unknown) as string[],
            }))
          }
          expandedKeys={temporaryCondition?.filteredSortArr || []}
          checkedKeys={temporaryCondition?.filteredSortArr || []}
        >
          {allSortList.map((item) => (
            <Tree.TreeNode
              title={item.name}
              key={`${item.id}`}
              selectable={false}
              disabled={item.isEnable === 0}
            >
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
      {filterType === 'tag' && (
        <Row>
          <Col span={3} className="mt5">
            请选择：
          </Col>
          <Col span={21}>
            {tagList.map((item) => (
              <Tag.CheckableTag
                key={item.id}
                checked={temporaryCondition?.tagIdsArr?.includes?.(item.id)}
                onChange={(checked) => handleTagSelect(item.id, checked)}
                className="mt5"
              >
                {item.name}
              </Tag.CheckableTag>
            ))}
          </Col>
        </Row>
      )}
    </Modal>
  )
}

export default memo(forwardRef(FilterModal))
