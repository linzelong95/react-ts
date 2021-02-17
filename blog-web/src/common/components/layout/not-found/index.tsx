import React from 'react'
import { Result, Button } from 'antd'
import styles from './index.less'

export function NotFound(): JSX.Element {
  return (
    <div className={styles['not-found-layout']}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary">Back Home</Button>}
      />
    </div>
  )
}
