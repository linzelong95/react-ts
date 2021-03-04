import React, { FC, useState, useRef, useLayoutEffect, memo, useMemo } from 'react'
import { COS_URL } from '@common/constants/cos'

interface PDFPreviewProps {
  fileKey: string
  signature: string
  fileType: string
  width?: number | string
  height?: number | string
}

const PDFPreview: FC<PDFPreviewProps> = (props) => {
  const { fileKey, signature, width, height } = props

  const container = useRef<HTMLIFrameElement>(null)

  const [containerWidth, setContainerWidth] = useState<number>(0)

  const defaultHeight = Math.min(containerWidth, 835) * 1.42

  useLayoutEffect(() => {
    if (container.current) setContainerWidth(container.current.offsetWidth)
  }, [])

  const pdfUrl = useMemo<string>(() => {
    const previewUrl = encodeURIComponent(`${COS_URL}/${fileKey}?sign=${signature}`)
    return `${__SERVER_ORIGIN__ || ''}/public/assets/pdf-viewer/web/viewer.html?file=${previewUrl}`
  }, [fileKey, signature])

  return (
    <iframe
      ref={container}
      src={pdfUrl}
      scrolling="no"
      frameBorder="0"
      width={width === undefined ? '100%' : width}
      height={height === undefined ? defaultHeight : height}
    />
  )
}

export default memo(PDFPreview)
