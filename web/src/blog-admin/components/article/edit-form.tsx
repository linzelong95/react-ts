import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Modal, Form, Input, Select, Cascader, Row, Col, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useService } from '@common/hooks'
import { Upload, RichEditor } from '@common/components'
import { adminTagServices } from '@blog-admin/services/tag'
import BraftEditor from 'braft-editor'
import type { ArticleTypeCollection, TagTypeCollection, Sort } from '@blog-admin/types'
import type { FC } from 'react'
import type { ModalProps } from 'antd/lib/modal'
import type { CascaderProps } from 'antd/lib/cascader'
import type { UploadProps } from 'antd/lib/upload'
import type { ToggleEditorialPanel, SaveData, DetailItem } from '@blog-admin/containers/article'
import 'cropperjs/dist/cropper.css'

interface EditFormProps extends ModalProps {
  initialValues?: DetailItem
  allSortList: Sort['listItemByAdminRole'][]
  onSave: SaveData
  onToggleEditorialPanel: ToggleEditorialPanel
}

type FormDataWhenEdited = ArticleTypeCollection['formDataWhenEdited']

const EditForm: FC<EditFormProps> = memo((props) => {
  const { initialValues, visible, allSortList, onSave, onToggleEditorialPanel, ...restProps } = props
  const [form] = Form.useForm<FormDataWhenEdited>()
  const [sortIdsArr, setSortIdsArr] = useState<number[]>([])
  const [categoryOptions, setCategoryOptions] = useState<any[]>([])

  const getTagListParams = useMemo<TagTypeCollection['getListParamsByAdminRole']>(
    () => ({
      index: 1,
      size: 999,
      conditionQuery: { sortIdsArr },
    }),
    [sortIdsArr],
  )
  const [tagLoading, tagRes, tagErr] = useService(adminTagServices.getList, getTagListParams, !sortIdsArr?.length)
  const tagList = useMemo(() => {
    if (!sortIdsArr?.length || tagLoading) return []
    if (tagErr) {
      message.error(tagErr.message || '获取列表失败')
      return []
    }
    return tagRes?.data?.list || []
  }, [sortIdsArr, tagLoading, tagRes, tagErr])

  const formatFileList = useCallback<UploadProps['onChange']>(({ fileList }) => {
    const validFileList = fileList.filter((file) => file.url && ['uploading', 'done'].includes(file.status))
    if (validFileList.length < fileList.length) Modal.error({ title: '上传失败', okText: '知道了' })
    return validFileList
  }, [])

  const handleCancel = useCallback<ModalProps['onCancel']>(() => {
    form.resetFields()
    onToggleEditorialPanel()
  }, [form, onToggleEditorialPanel])

  const handleOk = useCallback<ModalProps['onOk']>(() => {
    form
      .validateFields()
      .then((values) => {
        const { id } = initialValues || {}
        const { title, category, imageUrl, isTop, tags, abstract, content } = values
        const params: ArticleTypeCollection['editParams'] = {
          id,
          title,
          abstract,
          content: content.toHTML(),
          isTop,
          tags: tags.map((tag) => ({ id: tag.key, name: tag.label })),
          imageUrl: imageUrl?.[0]?.url,
          category: { id: category[category.length - 1] },
        }
        onSave(params, () => {
          form.resetFields()
          onToggleEditorialPanel()
        })
      })
      .catch((error) => {
        message.error(error.message || '请检查表单填写是否正确')
      })
  }, [form, initialValues, onSave, onToggleEditorialPanel])

  const categoryChange = useCallback<CascaderProps['onChange']>(
    (value) => {
      form.setFieldsValue({ tags: [] })
      setSortIdsArr(value.slice(0, 1) as number[])
    },
    [form],
  )

  useEffect(() => {
    const formattedCategories = allSortList
      .filter((sort) => sort?.categories?.length > 0)
      .map((sort) => ({
        ...sort,
        disabled: !sort?.isEnable,
        categories: sort?.categories?.map?.((category) => ({ ...category, disabled: !category.isEnable })) || [],
      }))
    setCategoryOptions(formattedCategories)
  }, [allSortList])

  const editingFormData = useMemo<FormDataWhenEdited>(() => {
    const { isTop = 0, category, imageUrl, tags, content, abstract, title } = initialValues || {}
    if (category?.sort?.id) setSortIdsArr([category.sort.id])
    const fileList = imageUrl ? [{ uid: '-1', url: imageUrl, status: 'done' }] : []
    return {
      title,
      abstract,
      isTop,
      imageUrl: fileList,
      content: BraftEditor.createEditorState(content),
      category: category?.sort?.id ? [category.sort.id, category.id] : [],
      tags: tags?.map?.((tag) => ({ key: tag.id, label: tag.name })) || [],
    } as FormDataWhenEdited
  }, [initialValues])

  return (
    <Modal
      destroyOnClose
      width={1000}
      title={initialValues?.id ? '更新' : '添加'}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      keyboard={false}
      {...restProps}
    >
      <Form labelCol={{ span: 3 }} wrapperCol={{ span: 19 }} form={form} initialValues={editingFormData}>
        <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题!' }]}>
          <Input />
        </Form.Item>
        <Form.Item noStyle>
          <Row>
            <Col span={12}>
              <Form.Item
                label="分类"
                name="category"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                rules={[{ required: true, message: '请选择分类!' }]}
              >
                <Cascader
                  options={categoryOptions}
                  fieldNames={{ label: 'name', value: 'id', children: 'categories' }}
                  onChange={categoryChange}
                  placeholder="Please select"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="标签"
                name="tags"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                rules={[{ required: true, message: '请选择文章!' }]}
              >
                <Select
                  labelInValue
                  mode="multiple"
                  disabled={!sortIdsArr?.length}
                  loading={tagLoading}
                  notFoundContent={null}
                  filterOption={false}
                >
                  {tagList?.map?.((tag) => (
                    <Select.Option value={tag.id} key={tag.id}>
                      {tag.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label="置顶" name="isTop" rules={[{ required: true, message: '请选择是否置顶!' }]}>
          <Select>
            <Select.Option value={1}>是</Select.Option>
            <Select.Option value={0}>否</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="封面"
          name="imageUrl"
          valuePropName="fileList"
          getValueFromEvent={formatFileList}
          rules={[{ required: true, message: '请上传封面' }]}
        >
          <Upload.Crop maxFiles={1} listType="picture-card" accept="image/*" cropperProps={{ aspectRatio: 23 / 16 }}>
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload.Crop>
        </Form.Item>
        <Form.Item label="摘要" name="abstract">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="正文" name="content" rules={[{ required: true, message: '请输入正文!' }]} style={{ marginBottom: 0 }}>
          <RichEditor />
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default EditForm
