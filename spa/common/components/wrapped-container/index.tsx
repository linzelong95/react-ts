import React, { memo } from 'react'
import styles from './index.module.scss'
import type { FC, CSSProperties } from 'react'

const WrappedContainer: FC<{ style?: CSSProperties }> = memo((props) => {
  const { children, ...restProps } = props

  return (
    <div className={styles['wrapped-container']} {...restProps}>
      {children}
    </div>
  )
})

export default WrappedContainer
