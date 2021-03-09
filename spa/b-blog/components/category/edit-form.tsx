import React, { memo, useCallback, useMemo } from 'react'
import { Modal, Form, Input, Select, message } from 'antd'
import type { Sort, Category } from '@b-blog/types'
import type { FC } from 'react'
import type { ModalProps } from 'antd/lib/modal'
import type { ToggleEditorialPanel, SaveData, ListItem } from '@b-blog/containers/category'

interface EditFormProps extends ModalProps {
  type: 'cate' | 'sort'
  initialValues?: ListItem
  allSortList: Sort['getListResByAdminRole']['list']
  onSave: SaveData
  onToggleEditorialPanel: ToggleEditorialPanel
}

type FormDataWhenEdited = (Sort | Category)['formDataWhenEdited']

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
}

const EditForm: FC<EditFormProps> = memo((props) => {
  const { type, initialValues, visible, allSortList, onSave, onToggleEditorialPanel, ...restProps } = props
  const [form] = Form.useForm<FormDataWhenEdited>()

  const handleCancel = useCallback<ModalProps['onCancel']>(() => {
    form.resetFields()
    onToggleEditorialPanel()
  }, [form, onToggleEditorialPanel])

  const handleOk = useCallback<ModalProps['onOk']>(() => {
    form
      .validateFields()
      .then((values) => {
        const { sort, ...commonValues } = values as Category['formDataWhenEdited']
        if (sort) (commonValues as Category['editParams']).sortId = sort.key
        onSave({ id: initialValues?.id, ...commonValues } as (Category | Sort)['editParams'], () => {
          form.resetFields()
          onToggleEditorialPanel()
        })
      })
      .catch((error) => {
        message.error(error.message)
      })
  }, [form, initialValues, onSave, onToggleEditorialPanel])

  const editingFormData = useMemo<FormDataWhenEdited>(() => {
    const { name, isEnable = 1, sort } = (initialValues || {}) as Category['listItemByAdminRole']
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
      <Form {...layout} form={form} initialValues={editingFormData}>
        <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称!' }]}>
          <Input />
        </Form.Item>
        {type === 'cate' && (
          <Form.Item label="所属" name="sort" rules={[{ required: true, message: '请选择状态!' }]}>
            <Select labelInValue>
              {allSortList.map((sort) => (
                <Select.Option key={sort.id} value={sort.id}>
                  {sort.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
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
