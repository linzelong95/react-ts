import React, { memo, FC } from 'react'
import { Modal, Button } from 'antd'
import { ModalProps } from 'antd/lib/modal'
import Preview from '../preview'
import { isPreviewSupported } from '../utils'

interface PreviewModalProps extends ModalProps {
  token: string
  height?: string | number
}

const PreviewModal: FC<PreviewModalProps> = memo((props) => {
  const { token, visible, onCancel, title, width, height, ...otherProps } = props

  if (!token) return null

  if (!isPreviewSupported(token) && visible) {
    Modal.warning({
      title: '该文件不支持预览，请下载后查看',
      okText: '知道了',
      onOk: onCancel,
    })
    return null
  }

  return (
    <Modal
      destroyOnClose
      title={title || '预览'}
      width={width || 1400}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button type="primary" key="close" onClick={onCancel}>
          关闭
        </Button>,
      ]}
      {...otherProps}
    >
      <Preview token={token} height={height} />
    </Modal>
  )
})

export default PreviewModal
