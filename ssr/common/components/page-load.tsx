import React, { memo } from 'react'
import { Spin } from 'antd'
import type { FC, CSSProperties } from 'react'

const loadingStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'rgba(255,255,255,0.3)',
  zIndex: 10001,
}

const PageLoad: FC = memo(() => {
  return (
    <div style={loadingStyle}>
      <Spin />
    </div>
  )
})

export default PageLoad
