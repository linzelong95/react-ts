import React, { useCallback } from 'react'
import { Result, Button } from 'antd'
import { useRouter } from 'next/router'
import { ButtonProps } from 'antd/lib/button'
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
  const router = useRouter()
  const backHome = useCallback<ButtonProps['onClick']>(() => {
    console.log(router)
    const { asPath } = router
    const [, rootPath] = asPath.split('/')
    router.push(`/${rootPath}`)
  }, [router])

  return (
    <div style={style}>
      <Result
        status="404"
        title="404"
        subTitle="该模块暂未开发，感谢您的支持"
        extra={
          <Button type="primary" onClick={backHome}>
            回到首页
          </Button>
        }
      />
    </div>
  )
}

export default NotFound
