import React, { useState, useEffect, useCallback, forwardRef, useMemo, memo } from 'react'
import { Upload as AntdUpload, message, Modal, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { COS_URL } from '../constant'
import { getCosSignature } from '@common/services/cos'
import moment from 'moment'
import { v4 as uuid } from 'uuid'
import type { ForwardRefRenderFunction } from 'react'
import type { UploadProps as AntdUploadProps, UploadFile } from 'antd/lib/upload/interface'

export interface UploadProps extends AntdUploadProps {
  maxFiles?: number
  children?: React.ReactNode
}

const Upload: ForwardRefRenderFunction<typeof AntdUpload, UploadProps> = (props, ref) => {
  const { fileList, maxFiles, children, beforeUpload, onChange, ...restProps } = props
  const { multiple = Number.isFinite(maxFiles) && maxFiles > 1, ...otherProps } = restProps
  const [cosUploadSignature, setCosUploadSignature] = useState<string>(undefined)

  const formattedMaxFiles = useMemo(() => {
    if (Number.isFinite(maxFiles)) return maxFiles
    return multiple ? Number.POSITIVE_INFINITY : 1
  }, [maxFiles, multiple])

  useEffect(() => {
    getCosSignature()
      .then((auth) => {
        setCosUploadSignature(auth)
      })
      .catch((error) => {
        message.error(error.message)
      })
  }, [])

  const getUploadParams = useCallback(
    (file: UploadFile) => {
      const fileKey = `blog_system/${moment().format('YYYYMM')}/${uuid()}_${file.name}`
      file.url = `${COS_URL}/${fileKey}`
      return {
        key: fileKey,
        Signature: cosUploadSignature,
        success_action_status: '200',
      }
    },
    [cosUploadSignature],
  )

  const handleChange = useCallback<AntdUploadProps['onChange']>(
    ({ file, fileList, event }) => {
      if (file.status === 'error') message.error(`${file.name}上传失败！`)
      if (file.status === 'done') message.success(`${file.name}上传成功！`)
      if (onChange) onChange({ file, fileList: fileList.slice(0, formattedMaxFiles), event })
    },
    [formattedMaxFiles, onChange],
  )

  const getFileKeyAndSignature = useCallback<(token: string) => Promise<{ fileKey: string; signature: string }>>(async (token) => {
    const fileKeyAndSignatureMap = { fileKey: '', signature: '' }
    if (!token) return fileKeyAndSignatureMap
    if (token.match(/^([^:]*:)?\/\/brief-1302086393[^/]*\//)) {
      const [, , fileKey] = token.match(/^([^:]*:)?\/\/brief-1302086393[^/]*\/([^?]*)/)
      if (!fileKey) return fileKeyAndSignatureMap
      fileKeyAndSignatureMap.fileKey = fileKey
    }
    try {
      fileKeyAndSignatureMap.signature = await getCosSignature(fileKeyAndSignatureMap.fileKey)
    } catch {}
    return fileKeyAndSignatureMap
  }, [])

  const handlePreview = useCallback<AntdUploadProps['onPreview']>(
    async (file) => {
      message.info('正在处理，请稍等...')
      const { fileKey, signature } = await getFileKeyAndSignature(file.url)
      if (!fileKey || !signature) return Modal.error({ title: '文件可能已损坏，预览失败', okText: '知道了' })
      window.open(`${COS_URL}/${encodeURIComponent(fileKey)}?sign=${encodeURIComponent(signature)}`)
      // 或window.open(`${COS_URL}/${encodeURIComponent(fileKey)}?${signature}`)
    },
    [getFileKeyAndSignature],
  )

  const handleDownload = useCallback<UploadProps['onDownload']>(
    async (file) => {
      message.info('正在处理，请稍等...')
      const { fileKey, signature } = await getFileKeyAndSignature(file.url)
      if (!fileKey || !signature) return Modal.error({ title: '文件可能已损坏，下载失败', okText: '知道了' })
      window.open(
        `${COS_URL}/${encodeURIComponent(fileKey)}?response-content-disposition=${encodeURIComponent(
          `attachment;filename="${fileKey.replace(/^blog_system\/\d{6}\/\w{8}(-\w{4}){3}-\w{12}_/, '')}"`,
        )}&${signature}`,
      )
    },
    [getFileKeyAndSignature],
  )

  const handleBeforeUpload = useCallback<AntdUploadProps['beforeUpload']>(
    (file, fileList) => {
      if (!file.size) {
        Modal.error({ title: '请不要上传空文件', okText: '知道了' })
        return Promise.reject(new Error('请不要上传空文件'))
      }
      if (beforeUpload) return beforeUpload(file, fileList)
    },
    [beforeUpload],
  )

  return (
    <AntdUpload
      onPreview={handlePreview}
      {...otherProps}
      ref={ref}
      action={COS_URL}
      multiple={multiple}
      data={getUploadParams}
      onChange={handleChange}
      onDownload={handleDownload}
      beforeUpload={handleBeforeUpload}
      fileList={fileList?.map?.((file, index) => ({ ...file, uid: file.uid || `${index}` })) || []}
    >
      {(!Array.isArray(fileList) || fileList.length < formattedMaxFiles) &&
        (children || (
          <Button>
            <UploadOutlined />
            <span>上传文件</span>
          </Button>
        ))}
    </AntdUpload>
  )
}

export default memo(forwardRef(Upload))
