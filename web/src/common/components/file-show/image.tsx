import React, { FC, memo } from 'react'
import { COS_URL } from '../constant'

interface ImagePreviewProps {
  fileKey: string
  signature: string
  fileType: string
  width?: number | string
  height?: number | string
}

const ImagePreview: FC<ImagePreviewProps> = (props) => {
  const { fileKey, signature, width, height } = props

  return (
    <div style={{ border: '1px solid #dedede', overflow: 'hidden', width, height }}>
      <img
        src={`${COS_URL}/${fileKey}?sign=${signature}`}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}

export default memo(ImagePreview)
