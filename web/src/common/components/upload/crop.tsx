import React, { memo, useCallback, useState, useRef } from 'react'
import Cropper from 'react-cropper'
import { Upload } from '@common/components'
import { Modal, Button, message } from 'antd'
import { upload, getFileKeyAndUrl } from '@common/utils'
import { COS_URL } from '@common/constants/cos'
import { getCosSignature } from '@common/services/cos'
import type { FC } from 'react'
import type { UploadProps } from '../upload'
import type { ButtonProps } from 'antd/lib/button'
import type { UploadRequestOption } from 'rc-upload/lib/interface'
import type { UploadFile } from 'antd/lib/upload/interface'
import type { ReactCropperProps, ReactCropperElement } from 'react-cropper'

interface CropImgProps extends UploadProps {
  cropperProps?: ReactCropperProps
}

const CropImg: FC<CropImgProps> = memo((props) => {
  const { cropperProps, fileList, children, onChange, ...uploadProps } = props
  const cropperRef = useRef<ReactCropperElement>(null)
  const [fileInfo, setFileInfo] = useState<{ name: string; dataUrL: string }>(null)
  const [formattedFile, setFormattedFile] = useState<UploadFile>(null)

  const removeObjectURL = useCallback<() => void>(() => {
    if (fileInfo?.dataUrL) window.URL.revokeObjectURL(fileInfo.dataUrL)
    setFileInfo(null)
    setFormattedFile(null)
  }, [fileInfo])

  const handleBeforeUpload = useCallback<UploadProps['beforeUpload']>((file) => {
    const { name } = file
    const dataUrL = window.URL.createObjectURL(file)
    setFileInfo({ name, dataUrL })
    return false
  }, [])

  const dataURLtoFile = useCallback<(dataUrl: string) => File>(
    (dataUrl) => {
      const [prefix, content] = dataUrl.split(',')
      const [, mime] = prefix.match(/:(.*?);/) || []
      const bstr = atob(content)
      let len = bstr.length
      const u8arr = new Uint8Array(len)
      while (len--) {
        u8arr[len] = bstr.charCodeAt(len)
      }
      return new File([u8arr], fileInfo.name, { type: mime })
    },
    [fileInfo],
  )

  const onCrop = useCallback<ReactCropperProps['crop']>(() => {
    if (!fileInfo?.dataUrL) return
    const cropper = cropperRef?.current?.cropper
    const base64 = cropper && cropper.getCroppedCanvas().toDataURL()
    if (!base64) {
      removeObjectURL()
      return
    }
    const file = (dataURLtoFile(base64) as unknown) as UploadFile
    setFormattedFile(file)
  }, [fileInfo, dataURLtoFile, removeObjectURL])

  const handleOk = useCallback<ButtonProps['onClick']>(async () => {
    message.loading({ content: '正在上传...', key: 'upload', duration: 0 })
    const [key, url] = getFileKeyAndUrl(formattedFile)
    const cosUploadSignature = await getCosSignature()
    upload({
      method: 'POST',
      action: COS_URL,
      file: formattedFile as UploadRequestOption['file'],
      data: {
        key,
        Signature: cosUploadSignature,
        success_action_status: '200',
      },
      onError: () => {
        message.error({ content: '上传失败', key: 'upload' })
      },
      onSuccess: () => {
        message.success({ content: '上传成功', key: 'upload' })
        removeObjectURL()
        formattedFile.url = url
        formattedFile.status = 'done'
        onChange({
          file: formattedFile,
          fileList: [...fileList.filter(({ url }) => url && url !== formattedFile.url), formattedFile],
          event: null,
        })
      },
    })
  }, [formattedFile, fileList, onChange, removeObjectURL])

  return (
    <>
      <Upload useInUploadCrop fileList={fileList} onChange={onChange} beforeUpload={handleBeforeUpload} {...uploadProps}>
        {children}
      </Upload>
      <Modal
        title="裁剪"
        visible={Boolean(fileInfo)}
        onOk={handleOk}
        maskClosable={false}
        keyboard={false}
        closable={false}
        zIndex={100001}
        footer={[
          <Button key="ok" onClick={handleOk}>
            确定
          </Button>,
        ]}
      >
        {Boolean(fileInfo) && (
          <Cropper
            ref={cropperRef}
            src={fileInfo?.dataUrL}
            initialAspectRatio={16 / 9}
            crop={onCrop}
            style={{ height: '100%', width: '100%' }}
            {...cropperProps}
          />
        )}
      </Modal>
    </>
  )
})

export default CropImg
