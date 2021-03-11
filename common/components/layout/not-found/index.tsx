import React from 'react'
import { Result, Button } from 'antd'
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

function NotFound(): JSX.Element {
  return (
    <div style={style}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" href="/">
            Back Home
          </Button>
        }
      />
    </div>
  )
}

export default NotFound
