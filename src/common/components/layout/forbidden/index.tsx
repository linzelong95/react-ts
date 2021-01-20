import React from 'react'
import { Result, Button } from 'antd'
import styles from './index.less'

export function Forbidden(): JSX.Element {
  return (
    <div className={styles['forbidden-layout']}>
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={<Button type="primary">Back Home</Button>}
      />
    </div>
  )
}
