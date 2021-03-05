import React, { memo } from 'react'
import Front from './front'
import styles from './index.less'
import type { FC, CSSProperties } from 'react'

const Container: FC<{ style?: CSSProperties }> = memo((props) => {
  const { children, ...restProps } = props

  return (
    <div className={styles['wrapped-container']} {...restProps}>
      {children}
    </div>
  )
})

const WrappedContainer = Object.assign(Container, {
  Front,
})

export { WrappedContainer }
