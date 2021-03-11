import React, { memo, useCallback, useMemo, useState } from 'react'
import { Modal, Form, Input, Select, message } from 'antd'
import { useService } from '@common/hooks'
import { articleServices } from '@b-blog/services'
import type { IReply, IArticle } from '@b-blog/types'
import type { FC } from 'react'
import type { ModalProps } from 'antd/lib/modal'
import type { ToggleEditorialPanel, SaveData, ListItem } from '@b-blog/containers/reply'

interface EditFormProps extends ModalProps {
  initialValues?: ListItem
  onSave: SaveData
  onToggleEditorialPanel: ToggleEditorialPanel
}

type FormDataWhenEdited = IReply['formDataWhenEdited']

const EditForm: FC<EditFormProps> = memo((props) => {
  const { initialValues, visible, onSave, onToggleEditorialPanel, ...restProps } = props
  const [form] = Form.useForm<FormDataWhenEdited>()
  const [articleSearch, setArticleSearch] = useState<string>(undefined)

  const getListParams = useMemo<IArticle['getListParams']>(
    () => ({
      index: 1,
      size: 10,
      conditionQuery: { title: articleSearch?.trim() },
    }),
    [articleSearch],
  )
  const [articleLoading, articleRes, articleErr] = useService(articleServices.getList, getListParams, Boolean(initialValues?.id))
  const articleList = useMemo(() => {
    if (articleErr) {
      message.error(articleErr.message || '获取列表失败')
      return []
    }
    return articleRes?.data?.list || []
  }, [articleRes, articleErr])

  const handleCancel = useCallback<ModalProps['onCancel']>(() => {
    form.resetFields()
    onToggleEditorialPanel()
  }, [form, onToggleEditorialPanel])

  const handleOk = useCallback<ModalProps['onOk']>(() => {
    form
      .validateFields()
      .then((values) => {
        const { id } = initialValues || {}
        const { to, isTop, reply, article } = values
        const parentId = initialValues?.parentId === 0 ? id : initialValues?.parentId
        const articleId = article.key
        const selectedArticle = articleList.find((article) => article.id === articleId)
        const toId = to?.key || selectedArticle?.user?.id
        onSave({ toId, parentId, isTop, reply, articleId }, () => {
          form.resetFields()
          onToggleEditorialPanel()
        })
      })
      .catch((error) => {
        message.error(error.message || '请检查表单填写是否正确')
      })
  }, [form, initialValues, articleList, onSave, onToggleEditorialPanel])

  const editingFormData = useMemo<FormDataWhenEdited>(() => {
    const { isTop = 0, from, article: prevArticle } = initialValues || {}
    const article = prevArticle && { key: prevArticle.id, label: prevArticle.title }
    const toKey = from?.id || prevArticle?.user?.id
    const toLabel = from?.nickName || prevArticle?.user?.nickName
    const to = toKey && { key: toKey, label: toLabel }
    return { isTop, to, article } as FormDataWhenEdited
  }, [initialValues])

  return (
    <Modal
      destroyOnClose
      title={initialValues?.id ? '回复' : '添加'}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      {...restProps}
    >
      <Form labelCol={{ span: 5 }} wrapperCol={{ span: 17 }} form={form} initialValues={editingFormData}>
        <Form.Item label="文章" name="article" rules={[{ required: true, message: '请选择文章!' }]}>
          <Select
            labelInValue
            showSearch
            disabled={Boolean(initialValues?.id)}
            loading={articleLoading}
            notFoundContent={null}
            filterOption={false}
            onSearch={setArticleSearch}
          >
            {articleList.map((article) => (
              <Select.Option value={article.id} key={article.id}>
                {article.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {initialValues?.id && (
          <>
            <Form.Item label="回复对象" name="to">
              <Select disabled labelInValue>
                <Select.Option value={editingFormData?.to?.key}>{editingFormData?.to?.label}</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="原评论">{initialValues.reply}</Form.Item>
          </>
        )}
        <Form.Item label="评论" name="reply" rules={[{ required: true, message: '请输入评论内容!' }]}>
          <Input.TextArea rows={2} />
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
