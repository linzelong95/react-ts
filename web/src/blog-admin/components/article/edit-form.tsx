import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Modal, Form, Input, Select, Cascader, message } from 'antd'
import { useService } from '@common/hooks'
import { Upload, Download, Preview } from '@common/components'
import { adminTagServices } from '@blog-admin/services/tag'
import type { UploadProps } from 'antd/lib/upload'
import type { ArticleTypeCollection, TagTypeCollection, Sort } from '@blog-admin/types'
import type { FC } from 'react'
import type { ModalProps } from 'antd/lib/modal'
import type { ToggleEditorialPanel, SaveData, DetailItem } from '@blog-admin/containers/article'

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
    if (tagErr) {
      message.error(tagErr.message || '获取列表失败')
      return []
    }
    return tagRes?.data?.list || []
  }, [tagRes, tagErr])

  // const formatFileList = useCallback<UploadProps['onChange']>(({ fileList }) => {
  //   console.log(98, fileList)
  //   const validFileList = fileList.filter((file) => file.url && ['uploading', 'done'].includes(file.status))
  //   if (validFileList.length < fileList.length) Modal.error({ title: '上传失败', okText: '知道了' })
  //   return validFileList
  // }, [])

  const formatFileList = useCallback<UploadProps['onChange']>((fileList) => {
    console.log(8888, fileList)
    if (Array.isArray(fileList)) {
      return fileList
    }
    return fileList.fileList
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
        console.log(values, id, onSave, onToggleEditorialPanel)
        // const { to, isTop, title } = values
        // const articleId = article.key
        // onSave({ id, isTop, title, articleId }, () => {
        //   form.resetFields()
        //   onToggleEditorialPanel()
        // })
      })
      .catch((error) => {
        message.error(error.message || '请检查表单填写是否正确')
      })
  }, [form, initialValues, onSave, onToggleEditorialPanel])

  useEffect(() => {
    setCategoryOptions(
      allSortList
        .filter((sort) => sort?.categories?.length > 0)
        .map((sort) => ({
          ...sort,
          disabled: !sort?.isEnable,
          categories: sort?.categories?.map?.((category) => ({ ...category, disabled: !category.isEnable })) || [],
        })),
    )
  }, [allSortList])

  const editingFormData = useMemo<FormDataWhenEdited>(() => {
    const { isTop = 0, category, imageUrl, tags, content } = initialValues || {}
    if (category?.sort?.id) setSortIdsArr([category.sort.id])
    const fileList = imageUrl ? [{ uid: -1, url: imageUrl }] : []
    return {
      isTop,
      fileList,
      content,
      category: category?.sort?.id ? [category.sort.id, category.id] : [],
      tags: tags?.map?.((tag) => ({ key: tag.id, label: tag.name })) || [],
    } as FormDataWhenEdited
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
      <Download token="https://brief-1302086393.cos.ap-shenzhen-fsi.myqcloud.com/blog_system/202103/b57a39d3-3f94-4043-8ad5-b1059748e47b_article.jpeg" />
      <Preview token="https://brief-1302086393.cos.ap-shenzhen-fsi.myqcloud.com/blog_system/202103/b57a39d3-3f94-4043-8ad5-b1059748e47b_article.jpeg" />
      <Preview token="https://brief-1302086393.cos.ap-shenzhen-fsi.myqcloud.com/blog_system/202103/ffd9b77f-7d28-46f3-a1c8-e14bb06b7ccf_林泽龙_前端开发_两年经验.pdf" />
      <Preview token="https://brief-1302086393.cos.ap-shenzhen-fsi.myqcloud.com/blog_system/202103/06b18b6e-7156-40ef-8d7e-c845def2f274_林泽龙_前端开发_两年经验.docx" />
      <Form labelCol={{ span: 5 }} wrapperCol={{ span: 17 }} form={form} initialValues={editingFormData}>
        <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题!' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="封面"
          name="imageUrl"
          getValueFromEvent={formatFileList}
          valuePropName="fileList"
          rules={[{ required: true, message: '请上传附件' }]}
        >
          <Upload maxFiles={1} />
        </Form.Item>
        <Form.Item label="摘要" name="abstract">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="分类" name="category" rules={[{ required: true, message: '请选择分类!' }]}>
          <Cascader
            options={categoryOptions}
            fieldNames={{ label: 'name', value: 'id', children: 'categories' }}
            onChange={(value) => setSortIdsArr(value.slice(0, 1) as number[])}
            placeholder="Please select"
          />
        </Form.Item>
        <Form.Item label="标签" name="tags" rules={[{ required: true, message: '请选择文章!' }]}>
          <Select
            labelInValue
            showSearch
            disabled={Boolean(initialValues?.id)}
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
        <Form.Item label="置顶" name="isTop" rules={[{ required: true, message: '请选择是否置顶!' }]} style={{ marginBottom: 0 }}>
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
