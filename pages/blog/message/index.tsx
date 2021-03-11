import React, { memo } from 'react'
import { Result, Button } from 'antd'
import Link from 'next/link'
import type { NextPage } from 'next'
import type { CSSProperties } from 'react'

const style: CSSProperties = {
  width: '100%',
  height: '100%',
  maxWidth: '100vw',
  maxHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const NotFound: NextPage = memo(() => {
  return (
    <div style={style}>
      <Result
        status="404"
        title="404"
        subTitle="该模块暂未开发，感谢您的支持"
        extra={
          <Button type="primary">
            <Link href="/blog">
              <a>回到首页</a>
            </Link>
          </Button>
        }
      />
    </div>
  )
})

export default NotFound
