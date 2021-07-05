import React, { useState, useEffect, useMemo, memo } from 'react'
import { Tooltip, message } from 'antd'
import { DownloadOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import PreviewModal from '../file-show/modal'
import { cosServices } from '@common/services'
import { COS_URL } from '@common/constants/cos'
import { isPreviewSupported } from '@common/utils'
import type { FC, ReactNode, CSSProperties, AnchorHTMLAttributes } from 'react'

export function getFilename(token: string): string {
  if (
    token?.match?.(
      /^([^:]*:)?\/\/brief-1302086393[^/]*\/blog_system{6}\/\w{8}(-\w{4}){3}-\w{12}_([^?]*)/,
    )
  ) {
    const [, , , filename] = token.match(
      /^([^:]*:)?\/\/brief-1302086393[^/]*\/blog_system{6}\/\w{8}(-\w{4}){3}-\w{12}_([^?]*)/,
    )
    return filename
  }
  return '附件'
}

export interface DownloadProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  token: string
  // 在浏览器新开窗口展示，默认为false
  showOnBrowserWindow?: boolean
  // 优先级： props.children >filename> getFilename(token)
  filename?: string
  // 预览文件框高
  previewBoxHeight?: string | number
  // 是否启用预览，默认为false
  showPreview?: boolean
  // 是否一行展示，默认为true，对props.children无效
  showInOneRow?: boolean
}

const Download: FC<DownloadProps> = memo((props) => {
  const {
    token,
    showOnBrowserWindow,
    showPreview,
    previewBoxHeight,
    filename,
    children,
    showInOneRow = true,
    style,
    ...otherProps
  } = props

  const [previewModalVisible, setPreviewModalVisible] = useState<boolean>(false)
  const [cosUploadSignature, setCosUploadSignature] = useState<string>(undefined)

  const cosFileKey = useMemo<string>(() => {
    if (token?.match?.(/^([^:]*:)?\/\/brief-1302086393[^/]*\//)) {
      const [, , fileKey] = token.match(/^([^:]*:)?\/\/brief-1302086393[^/]*\/([^?]*)/)
      return fileKey
    }
    return undefined
  }, [token])

  const downloadUrl = useMemo<string>(() => {
    if (!cosFileKey || !cosUploadSignature) return undefined
    const contentDisposition = showOnBrowserWindow
      ? ''
      : `response-content-disposition=${encodeURIComponent(
          `attachment;filename="${getFilename(token)}"`,
        )}`
    return `${COS_URL}/${encodeURIComponent(cosFileKey)}?${
      contentDisposition ? `${contentDisposition}&` : ''
    }${cosUploadSignature}`
  }, [cosFileKey, cosUploadSignature, showOnBrowserWindow, token])

  useEffect(() => {
    if (!cosFileKey) return
    cosServices
      .getCosSignature(cosFileKey)
      .then((cosUploadSignature) => {
        setCosUploadSignature(cosUploadSignature)
      })
      .catch((error) => {
        message.error(error.message)
      })
  }, [cosFileKey])

  const downloadComponent = useMemo<ReactNode>(() => {
    const iconStyle: CSSProperties =
      !children && showInOneRow
        ? { position: 'absolute', right: showPreview ? 28 : 5, top: 4 }
        : { marginLeft: 10 }
    const linkStyle: CSSProperties =
      !children && showInOneRow
        ? {
            display: 'inline-block',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }
        : {}
    return (
      <a
        {...otherProps}
        href={downloadUrl || null}
        target="_blank"
        rel="noopener noreferrer"
        style={linkStyle}
      >
        {children || (
          <>
            {filename || getFilename(token)}
            <DownloadOutlined style={iconStyle} />
          </>
        )}
      </a>
    )
  }, [downloadUrl, otherProps, children, filename, token, showInOneRow, showPreview])

  const previewComponent = useMemo<ReactNode>(() => {
    if (!showPreview) return null
    const supportPreview: boolean = isPreviewSupported(token)
    const iconStyle: CSSProperties =
      !children && showInOneRow ? { position: 'absolute', right: 5, top: 4 } : { marginLeft: 5 }
    return (
      <>
        <Tooltip title={supportPreview ? '预览' : '不支持预览'}>
          {supportPreview ? (
            <EyeOutlined
              style={{ color: '#3a87f1', ...iconStyle }}
              onClick={() => {
                supportPreview && setPreviewModalVisible(true)
              }}
            />
          ) : (
            <EyeInvisibleOutlined
              style={{ color: '#3a87f1', ...iconStyle }}
              onClick={() => {
                supportPreview && setPreviewModalVisible(true)
              }}
            />
          )}
        </Tooltip>
        {supportPreview && (
          <PreviewModal
            token={token}
            height={previewBoxHeight}
            visible={previewModalVisible}
            onCancel={() => {
              setPreviewModalVisible(false)
            }}
          />
        )}
      </>
    )
  }, [token, showPreview, previewBoxHeight, previewModalVisible, children, showInOneRow])

  return (
    <span
      style={
        !children && showInOneRow
          ? {
              height: 19,
              maxWidth: '100%',
              position: 'relative',
              display: 'inline-block',
              paddingRight: showPreview ? 50 : 22,
              verticalAlign: 'text-bottom',
              lineHeight: 1.5,
              ...style,
            }
          : style
      }
    >
      {downloadComponent}
      {previewComponent}
    </span>
  )
})

export default Download
