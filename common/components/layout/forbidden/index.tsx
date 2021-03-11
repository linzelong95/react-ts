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

function Forbidden(): JSX.Element {
  return (
    <div style={style}>
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary" href="/">
            Back Home
          </Button>
        }
      />
    </div>
  )
}

export default Forbidden
