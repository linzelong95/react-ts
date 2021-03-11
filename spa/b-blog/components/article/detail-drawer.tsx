import React, { memo, useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { Drawer, Tag, Row, Col, Comment, Button, List, Divider, Form, Select, Input, InputNumber, message } from 'antd'
import moment from 'moment'
import {
  TagsOutlined,
  ReloadOutlined,
  UpCircleOutlined,
  DownCircleOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  ClockCircleOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { useService } from '@common/hooks'
import { RichEditor } from '@common/components'
import { useSelector } from 'react-redux'
import { replyServices } from '@b-blog/services'
import type { IReply } from '@b-blog/types'
import type { DrawerProps } from 'antd/lib/drawer'
import type { TagProps } from 'antd/lib/tag'
import type { ButtonProps } from 'antd/lib/button'
import type { FC, ReactNode } from 'react'
import type { StoreState } from '@common/store/types'
import type { DetailItem } from '@b-blog/containers/article'

interface DetailDrawerProps extends DrawerProps {
  detailItem: DetailItem
}

type FormattedReplyItem = IReply['listItem'] & { children?: IReply['listItem'][] }
export type HandleReplyItems = (type: 'remove' | 'approve' | 'disapprove' | 'top' | 'unTop', record: FormattedReplyItem) => void

const DetailDrawer: FC<DetailDrawerProps> = memo((props) => {
  const { visible, detailItem, onClose } = props
  const formRef = useRef<HTMLDivElement>(null)
  const [form] = Form.useForm<IReply['formDataWhenEdited']>()
  const [replyBoxVisible, setReplyBoxVisible] = useState<boolean>(false)
  const [clientHeight, setClientHeight] = useState<number>(document.documentElement.clientHeight)
  const [replyConditionQuery, setReplyConditionQuery] = useState<IReply['getListParams']['conditionQuery']>({
    prettyFormat: true,
    articleIdsArr: [detailItem.id],
    orderBy: undefined,
  })

  const getReplyListParams = useMemo<IReply['getListParams']>(() => {
    return {
      index: 1,
      size: 9999,
      conditionQuery: replyConditionQuery,
    }
  }, [replyConditionQuery])

  const [loading, replyRes, replyErr, forceRequest] = useService(replyServices.getList, getReplyListParams)

  const [replyTotal, replyList] = useMemo(() => {
    if (replyErr) {
      message.error(replyErr.message || '获取列表失败')
      return [0, []]
    }
    return [replyRes?.data?.total || 0, replyRes?.data?.list || []]
  }, [replyRes, replyErr])

  const currentUser = useSelector<StoreState, StoreState['user']>((state) => state.user)

  const replySort = useCallback<TagProps['onClick']>(({ currentTarget }) => {
    const name = currentTarget.id as IReply['getListParams']['conditionQuery']['orderBy']['name']
    setReplyConditionQuery((prevValue) => ({ ...prevValue, orderBy: { name, by: prevValue?.orderBy?.by === 'ASC' ? 'DESC' : 'ASC' } }))
  }, [])

  const prepareForReplying = useCallback<(item: FormattedReplyItem) => void>(
    (item) => {
      const { from, id, parentId: pid } = item
      const parentId = pid > 0 ? pid : id
      const to = { label: from?.nickname || '博主', key: from.id || detailItem.user.id }
      setReplyBoxVisible((prevValue) => !prevValue)
      setTimeout(() => {
        form.setFieldsValue({ parentId, to })
        formRef?.current?.scrollIntoView?.({ behavior: 'smooth' })
      }, 100)
    },
    [form, detailItem],
  )

  const handleReply = useCallback<ButtonProps['onClick']>(() => {
    form
      .validateFields()
      .then(async (values) => {
        const { parentId, to, reply } = values
        const toId = typeof to.key === 'number' ? to.key : undefined
        message.loading({ content: '正在提交...', key: 'saveData', duration: 0 })
        const [, saveErr] = await replyServices.save({ toId, parentId, reply, articleId: detailItem.id })
        if (saveErr) {
          message.error({ content: saveErr.message || '提交失败', key: 'saveData' })
          return
        }
        message.success({ content: '操作成功', key: 'saveData' })
        forceRequest()
        form.resetFields()
        setReplyBoxVisible((prevValue) => !prevValue)
      })
      .catch((error) => {
        message.error(error.message || '请检查表单填写是否正确')
      })
  }, [form, detailItem, forceRequest])

  const handleReplyItems = useCallback<HandleReplyItems>(
    async (type, record) => {
      const handlingItems = [record].map((item) => ({ id: item.id, parentId: item.parentId }))
      const [, err] = await replyServices[type]({ items: handlingItems })
      if (err) {
        message.error('操作失败')
        return
      }
      forceRequest()
    },
    [forceRequest],
  )

  const getCommentComponent = useCallback<(item: FormattedReplyItem) => ReactNode>(
    (item) => {
      const { roleName } = currentUser
      const { id, createDate, from, isApproved, to, parentId, children, reply } = item
      return (
        <Comment
          key={id}
          actions={[
            <span key="createDate">{moment(new Date(createDate)).format('YYYY-MM-DD')}</span>,
            <a key="reply" onClick={() => prepareForReplying(item)} style={{ fontSize: 12 }}>
              回复
            </a>,
            roleName === 'admin' && (
              <a key="remove" onClick={() => handleReplyItems('remove', item)} style={{ color: 'red', marginLeft: 10, fontSize: 12 }}>
                删除
              </a>
            ),
            roleName === 'admin' && isApproved === 0 && (
              <a key="approve" onClick={() => handleReplyItems('approve', item)} style={{ color: '#66CD00', marginLeft: 10, fontSize: 12 }}>
                展示
              </a>
            ),
            roleName === 'admin' && isApproved === 1 && (
              <a
                key="disapprove"
                onClick={() => handleReplyItems('disapprove', item)}
                style={{ color: '#BF3EFF', marginLeft: 10, fontSize: 12 }}
              >
                隐藏
              </a>
            ),
          ]}
          author={`${from.nickname}${parentId ? `回复@ ${to.nickname}` : ''}`}
          avatar={from?.avatar || `${__SERVER_ORIGIN__ || ''}/public/assets/images/default/avatar.jpeg`}
          content={<span style={{ color: isApproved === 0 ? 'lightgray' : '' }}>{reply}</span>}
        >
          {children?.map?.((item) => getCommentComponent(item))}
        </Comment>
      )
    },
    [currentUser, handleReplyItems, prepareForReplying],
  )

  useEffect(() => {
    const onWindowResize = () => setClientHeight(document.documentElement.clientHeight)
    window.addEventListener('resize', onWindowResize)
    return () => removeEventListener('resize', onWindowResize)
  }, [])

  return (
    <Drawer
      visible={visible}
      title={
        <div style={{ textAlign: 'center' }}>
          <span style={{ marginRight: 10 }}>{detailItem.title}</span>
          <Tag color="purple">
            <TagsOutlined style={{ marginRight: 10 }} />
            {detailItem.category.sort.name},{detailItem.category.name}
          </Tag>
        </div>
      }
      placement="bottom"
      height={clientHeight - 70}
      closable
      onClose={onClose}
    >
      <Row justify="center" gutter={24}>
        <Col span={16} style={{ maxHeight: clientHeight - 170, overflow: 'auto' }}>
          <div style={{ paddingRight: 15 }}>
            {detailItem?.tags?.length > 0 && (
              <p style={{ textIndent: '2em' }}>
                <b>标签：</b>
                {detailItem.tags.map((tag) => (
                  <Tag style={{ textIndent: '0em' }} key={tag.id}>
                    {tag.name}
                  </Tag>
                ))}
              </p>
            )}
            {detailItem.abstract && (
              <p style={{ textIndent: '2em' }}>
                <b>摘要：</b>
                {detailItem.abstract}
              </p>
            )}
            <img src={detailItem.imageUrl || `${__SERVER_ORIGIN__ || ''}/public/assets/images/default/article.jpeg`} width="100%" />
            <RichEditor.Preview value={detailItem.content} />
            <div style={{ marginBottom: 10, fontSize: 12, textAlign: 'center' }}>
              <span>
                <ClockCircleOutlined style={{ marginRight: 10 }} />
                {moment(new Date(detailItem.createDate)).format('YYYY-MM-DD')}
              </span>
              <span style={{ marginLeft: 20 }}>
                <EditOutlined style={{ marginRight: 10 }} />
                {moment(new Date(detailItem.updateDate)).format('YYYY-MM-DD')}
              </span>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div ref={formRef} style={{ marginBottom: 30 }}>
            <h2>
              <span style={{ marginRight: 10 }}>回复区</span>
              {replyBoxVisible ? (
                <DownCircleOutlined style={{ color: '#1890FF' }} onClick={() => setReplyBoxVisible((prevValue) => !prevValue)} />
              ) : (
                <UpCircleOutlined style={{ color: '#1890FF' }} onClick={() => setReplyBoxVisible((prevValue) => !prevValue)} />
              )}
            </h2>
            <Divider style={{ marginTop: -5 }} />
            {replyBoxVisible && (
              <Form
                form={form}
                requiredMark={false}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 19 }}
                initialValues={{
                  to: { label: '博主', key: detailItem.user.id },
                }}
              >
                <Form.Item label="对象" name="to">
                  <Select labelInValue>
                    <Select.Option value={detailItem.user.id}>博主</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="回复" name="reply" rules={[{ required: true, message: '请输入回复内容!' }]}>
                  <Input.TextArea rows={2} />
                </Form.Item>
                <Form.Item hidden name="parentId">
                  <InputNumber />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 23 }}>
                  <div style={{ float: 'right' }}>
                    <Button size="small" style={{ marginRight: 10 }} onClick={() => form.resetFields()}>
                      重置
                    </Button>
                    <Button size="small" type="primary" onClick={handleReply}>
                      发送
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            )}
          </div>
          <div>
            <h2>
              <span>评论({replyTotal || 0})</span>
              <ReloadOutlined style={{ color: '#1890FF', marginLeft: 10 }} onClick={forceRequest} />
              <Tag color="magenta" id="createDate" style={{ marginLeft: 10 }} onClick={replySort}>
                时间
                {replyConditionQuery?.orderBy?.name === 'createDate' && replyConditionQuery?.orderBy?.by === 'ASC' ? (
                  <CaretUpOutlined />
                ) : (
                  <CaretDownOutlined />
                )}
              </Tag>
            </h2>{' '}
            <Divider style={{ marginTop: -5 }} />
            <div
              style={{
                maxHeight: replyBoxVisible ? clientHeight - 460 : clientHeight - 300,
                overflow: 'auto',
              }}
            >
              <List loading={loading} itemLayout="horizontal" dataSource={replyList || []} renderItem={getCommentComponent} />
            </div>
          </div>
        </Col>
      </Row>
    </Drawer>
  )
})

export default DetailDrawer
