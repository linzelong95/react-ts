import React, { memo, useCallback, useMemo } from 'react'
import { Modal, Form, Input, Select, message } from 'antd'
import type { Sort, TagTypeCollection } from '@blog-admin/types'
import type { FC } from 'react'
import type { ModalProps } from 'antd/lib/modal'
import type { ToggleEditorialPanel, SaveData, ListItem } from '@blog-admin/containers/tag'

interface EditFormProps extends ModalProps {
  initialValues?: ListItem
  allSortList: Sort['getListResByAdminRole']['list']
  onSave: SaveData
  onToggleEditorialPanel: ToggleEditorialPanel
}

type FormDataWhenEdited = TagTypeCollection['formDataWhenEdited']

const EditForm: FC<EditFormProps> = memo((props) => {
  const { initialValues, visible, allSortList, onSave, onToggleEditorialPanel, ...restProps } = props
  const [form] = Form.useForm<FormDataWhenEdited>()

  const handleCancel = useCallback<ModalProps['onCancel']>(() => {
    form.resetFields()
    onToggleEditorialPanel()
  }, [form, onToggleEditorialPanel])

  const handleOk = useCallback<ModalProps['onOk']>(() => {
    form
      .validateFields()
      .then((values) => {
        const { sort, ...commonValues } = values
        onSave({ id: initialValues?.id, sortId: sort.key, ...commonValues }, () => {
          form.resetFields()
          onToggleEditorialPanel()
        })
      })
      .catch((error) => {
        message.error(error.message)
      })
  }, [form, initialValues, onSave, onToggleEditorialPanel])

  const editingFormData = useMemo<FormDataWhenEdited>(() => {
    const { name, isEnable = 1, sort } = initialValues || {}
    const defaultValues = { isEnable, name } as FormDataWhenEdited
    return { ...defaultValues, sort: sort ? { label: sort.name, key: sort.id } : undefined }
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
      <Form labelCol={{ span: 5 }} wrapperCol={{ span: 17 }} form={form} initialValues={editingFormData}>
        <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="所属" name="sort" rules={[{ required: true, message: '请选择状态!' }]}>
          <Select labelInValue>
            {allSortList.map((sort) => (
              <Select.Option key={sort.id} value={sort.id}>
                {sort.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="状态" name="isEnable" rules={[{ required: true, message: '请选择状态!' }]} style={{ marginBottom: 0 }}>
          <Select>
            <Select.Option value={1}>可用</Select.Option>
            <Select.Option value={0}>不可用</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default EditForm
