import React, { memo } from 'react'
import styles from './index.less'
import type { FC } from 'react'

const WrappedContainer: FC = memo((props) => {
  const { children } = props

  return <div className={styles['wrapped-container']}>{children}</div>
})

export { WrappedContainer }
