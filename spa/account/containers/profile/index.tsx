import React, { memo } from 'react'
import { Card, Result, Button } from 'antd'
import type { FC } from 'react'
import type { RouteComponentProps } from 'react-router'

const Register: FC<RouteComponentProps<{ id: string }>> = memo((props) => {
  const { id } = props.match.params
  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card style={{ width: 600 }}>
        <Result
          status="success"
          title="亲，该页面还未开发"
          subTitle={`您的id是${id},欢迎来到这里，感谢您的使用`}
          extra={[
            <Button type="primary" key="console" href="/blog">
              去博客逛逛？
            </Button>,
          ]}
        />
      </Card>
    </div>
  )
})

export default Register
