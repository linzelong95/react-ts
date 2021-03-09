import React, { memo } from 'react'
import type { FC } from 'react'
import 'braft-editor/dist/index.css'
import styles from './style.module.scss'

const Preview: FC<{ value: string }> = memo((props) => {
  const { value } = props
  return <div className={styles['rich-text-container']} dangerouslySetInnerHTML={{ __html: value }} />
})

export default Preview
