import React, { useMemo, useEffect, useState, memo } from 'react'
import { Spin } from 'antd'
import ImagePreview from './image'
import PDFPreview from './pdf'
import { getCosSignature } from '@common/services/cos'
import { getFileType } from '@common/utils'
import type { FC, CSSProperties } from 'react'

const styles: CSSProperties = {
  width: '100%',
  height: 200,
  border: '1px solid #dedede',
  background: '#eaeaea',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

function getEncodedUrl(fileKey: string): string {
  let encodedUrl = fileKey
  try {
    encodedUrl = encodedUrl
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/')
  } catch {}
  return encodedUrl
}

interface PreviewProps {
  token: string
  width?: number | string
  height?: number | string
}

const Preview: FC<PreviewProps> = memo((props) => {
  const { token, width, height } = props
  const [loading, setLoading] = useState<boolean>(true)
  const [cosSignature, setCosSignature] = useState<string>(undefined)
  const parsedToken = useMemo(() => {
    if (!token) return null
    if (token.match(/^([^:]*:)?\/\/brief-1302086393[^/]*\/[^?]*\?sign=/)) {
      const [, , fileKey, signature] = token.match(/^([^:]*:)?\/\/brief-1302086393[^/]*\/([^?]*)\?sign=(.*)$/)
      return { fileKey, signature }
    }
    if (token.match(/^([^:]*:)?\/\/brief-1302086393[^/]*\//)) {
      const [, , fileKey] = token.match(/^([^:]*:)?\/\/brief-1302086393[^/]*\/([^?]*)/)
      return { fileKey }
    }
    return null
  }, [token])

  useEffect(() => {
    if (!parsedToken?.fileKey || parsedToken?.signature) {
      setLoading(false)
      return
    }
    getCosSignature(parsedToken.fileKey)
      .then((auth) => {
        setCosSignature(encodeURIComponent(auth))
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [parsedToken])

  if (!parsedToken) {
    return (
      <div style={{ ...styles, width, height }}>
        <span>格式有误...</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ ...styles, width, height }}>
        <Spin />
      </div>
    )
  }

  const { fileKey, signature } = parsedToken

  const fileType = getFileType(fileKey)

  const PreviewComponent = {
    image: ImagePreview,
    pdf: PDFPreview,
  }[fileType]

  return PreviewComponent && (signature || cosSignature) ? (
    <PreviewComponent
      fileKey={getEncodedUrl(fileKey)}
      signature={signature || cosSignature}
      fileType={fileType}
      width={width}
      height={height}
    />
  ) : (
    <div style={{ ...styles, width, height }}>
      <span>类型不支持...</span>
    </div>
  )
})

export default Preview
