import React, { memo, useMemo, useCallback, useRef } from 'react'
import { Drawer, Button, Divider, Tooltip, Comment, List, Form, Input, Select, InputNumber, message } from 'antd'
import { SyncOutlined, PaperClipOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { useService } from '@common/hooks'
import { adminMessageServices } from '@b-blog/services/message'
import moment from 'moment'
import type { Message } from '@b-blog/types'
import type { StoreState } from '@common/store/types'
import type { FC, ReactNode } from 'react'
import type { DrawerProps } from 'antd/lib/drawer'
import type { ButtonProps } from 'antd/lib/button'
import type { ListItem, SaveData, HandleItems } from '@b-blog/containers/message'

interface MessageDrawerProps extends DrawerProps {
  onToggleMessageDrawer: () => void
  onSave: SaveData
  onHandleItems: HandleItems
}

type MessageItem = ListItem & { children?: ListItem[] }

const MessageDrawer: FC<MessageDrawerProps> = memo((props) => {
  const { visible, width, onToggleMessageDrawer, onSave, onHandleItems } = props
  const formRef = useRef<HTMLDivElement>(null)
  const [form] = Form.useForm<Message['formDataWhenEdited']>()
  const currentUser = useSelector<StoreState, StoreState['user']>((state) => state.user)
  const getListParams = useMemo<Message['getListParamsByAdminRole']>(
    () => ({
      index: 1,
      size: 999,
      conditionQuery: { prettyFormat: true },
    }),
    [],
  )
  const [loading, messageRes, messageErr, forceRequest] = useService(adminMessageServices.getList, getListParams)

  const [total, dataSource] = useMemo(() => {
    if (messageErr) {
      message.error(messageErr.message || '获取列表失败')
      return [0, []]
    }
    return [messageRes?.data?.total || 0, (messageRes?.data?.list as MessageItem[]) || []]
  }, [messageRes, messageErr])

  const handleWriteMessage = useCallback<ButtonProps['onClick']>(() => {
    form
      .validateFields()
      .then((values) => {
        const { parentId, to, message, blog, fromMail } = values
        const toId = typeof to.key === 'number' ? to.key : undefined
        const toMail = typeof to.key !== 'number' && to.key !== '博主' ? to.key : ''
        onSave({ parentId, message, toId, toMail, blog, fromMail }, () => {
          forceRequest()
          form.resetFields()
        })
      })
      .catch((error) => {
        message.error(error.message || '请检查表单填写是否正确')
      })
  }, [form, forceRequest, onSave])

  const prepareForReplying = useCallback<(item: MessageItem) => void>(
    (item) => {
      const { from, id, parentId: pid, fromMail = '博主' } = item
      const parentId = pid > 0 ? pid : id
      const to = { label: from.nickName || fromMail, key: from.id || fromMail } as Message['formDataWhenEdited']['to']
      form.setFieldsValue({ parentId, to })
      formRef?.current?.scrollIntoView?.({ behavior: 'smooth' })
    },
    [form],
  )

  const getCommentComponent = useCallback<(item: MessageItem) => ReactNode>(
    (item) => {
      const { roleName } = currentUser
      const { id, createDate, from, isApproved, to, fromMail, toMail, blog, message, parentId, children } = item
      return (
        <Comment
          key={id}
          actions={[
            <span key="createDate">{moment(new Date(createDate)).format('YYYY-MM-DD')}</span>,
            <a key="reply" onClick={() => prepareForReplying(item)}>
              回复
            </a>,
            (roleName === 'admin' || currentUser.id === from?.id) && (
              <a onClick={() => onHandleItems('remove', item, forceRequest)} style={{ color: 'red' }}>
                删除
              </a>
            ),
            roleName === 'admin' && isApproved === 0 && (
              <a onClick={() => onHandleItems('approve', item, forceRequest)} style={{ color: '#66CD00' }}>
                展示
              </a>
            ),
            roleName === 'admin' && isApproved === 1 && (
              <a onClick={() => onHandleItems('disapprove', item, forceRequest)} style={{ color: '#BF3EFF' }}>
                隐藏
              </a>
            ),
          ]}
          author={
            <span>
              {from ? (from.roleName === 'admin' ? '博主' : from.nickName) : `${fromMail || ''}[游客]`}&nbsp;
              {blog && (
                <Tooltip title="博客地址">
                  <a href={blog} target="_blank" rel="noopener noreferrer">
                    <PaperClipOutlined />
                  </a>
                </Tooltip>
              )}
              {parentId > 0 && (
                <>
                  &nbsp;回复&nbsp;
                  {to ? (to.roleName === 'admin' ? '博主' : to.nickName) : `${toMail || ''}[游客]`}
                </>
              )}
            </span>
          }
          avatar={from?.avatar || `${__SERVER_ORIGIN__ || ''}/public/assets/images/default/avatar.jpeg`}
          content={
            isApproved || roleName === 'admin' ? (
              <span style={{ color: isApproved === 0 ? 'lightgray' : '' }}>{message}</span>
            ) : (
              '（该评论待审核）'
            )
          }
        >
          {children?.map?.((item) => getCommentComponent(item))}
        </Comment>
      )
    },
    [currentUser, onHandleItems, forceRequest, prepareForReplying],
  )

  return (
    <Drawer visible={visible} title="留言" onClose={onToggleMessageDrawer} width={width || 400}>
      <div ref={formRef} />
      <Form form={form} requiredMark={false} labelCol={{ span: 4 }} wrapperCol={{ span: 19 }}>
        <Form.Item label="对象" name="to">
          <Select labelInValue>
            <Select.Option value={'博主'}>博主</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="留言" name="message" rules={[{ required: true, message: '请输入留言内容!' }]}>
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="博客" name="blog">
          <Input />
        </Form.Item>
        <Form.Item label="邮箱" name="fromMail" rules={[{ required: Boolean(currentUser.id), type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item hidden name="parentId">
          <InputNumber />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 23 }}>
          <div style={{ float: 'right' }}>
            <Button size="small" style={{ marginRight: 10 }} onClick={() => form.resetFields()}>
              重置
            </Button>
            <Button size="small" type="primary" onClick={handleWriteMessage}>
              发送
            </Button>
          </div>
        </Form.Item>
      </Form>
      <Divider orientation="left">
        <b style={{ color: '#1890FF', fontSize: 20 }}>{total}</b>
        <span style={{ margin: '0px 10px' }}>条留言</span>
        <SyncOutlined style={{ color: '#1890FF' }} onClick={forceRequest} />
      </Divider>
      <List loading={loading} itemLayout="horizontal" dataSource={dataSource} renderItem={getCommentComponent} />
    </Drawer>
  )
})

export default MessageDrawer
