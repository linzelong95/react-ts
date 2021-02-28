import React, { memo, useCallback, useMemo } from 'react'
import { Modal, Form, Input, Select, message } from 'antd'
import type { ReplyTypeCollection } from '@blog-admin/types'
import type { FC } from 'react'
import type { ModalProps } from 'antd/lib/modal'
import type { ToggleEditorialPanel, SaveData, ListItem } from '@blog-admin/containers/reply'

interface EditFormProps extends ModalProps {
  initialValues?: ListItem
  onSave: SaveData
  onToggleEditorialPanel: ToggleEditorialPanel
}

type FormDataWhenEdited = ReplyTypeCollection['formDataWhenEdited']

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
}

const EditForm: FC<EditFormProps> = memo((props) => {
  const { initialValues, visible, onSave, onToggleEditorialPanel, ...restProps } = props
  const [form] = Form.useForm<FormDataWhenEdited>()

  const handleCancel = useCallback<ModalProps['onCancel']>(() => {
    form.resetFields()
    onToggleEditorialPanel()
  }, [form, onToggleEditorialPanel])

  const handleOk = useCallback<ModalProps['onOk']>(() => {
    form
      .validateFields()
      .then((values) => {
        const { id } = initialValues || {}
        const { to, isTop, reply } = values
        const parentId = initialValues?.parentId === 0 ? id : initialValues?.parentId
        const toId = to?.key
        const articleId = 1
        onSave({ toId, parentId, isTop, reply, articleId }, () => {
          form.resetFields()
          onToggleEditorialPanel()
        })
      })
      .catch((error) => {
        message.error(error.message || '请检查表单填写是否正确')
      })
  }, [form, initialValues, onSave, onToggleEditorialPanel])

  const editingFormData = useMemo<FormDataWhenEdited>(() => {
    const { isTop = 1, from } = initialValues || {}
    const to = { key: from.id, label: from.nickName }
    return { isTop, to } as FormDataWhenEdited
  }, [initialValues])

  return (
    <Modal
      destroyOnClose
      title={initialValues?.id ? '更新' : '添加'}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      {...restProps}
    >
      <Form {...layout} form={form} initialValues={editingFormData}>
        {initialValues?.id && (
          <>
            <Form.Item label="回复对象" name="to">
              <Select disabled labelInValue>
                <Select.Option value={1}>是</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="原留言">{initialValues.reply}</Form.Item>
          </>
        )}
        <Form.Item label="留言" name="message" rules={[{ required: true, message: '请输入留言内容!' }]}>
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="是否置顶" name="isTop" rules={[{ required: true, message: '请选择是否置顶!' }]} style={{ marginBottom: 0 }}>
          <Select>
            <Select.Option value={1}>是</Select.Option>
            <Select.Option value={0}>否</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default EditForm
