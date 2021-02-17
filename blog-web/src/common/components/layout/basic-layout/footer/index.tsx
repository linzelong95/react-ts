import React, { memo } from 'react'
import { Layout } from 'antd'
import { CopyrightOutlined } from '@ant-design/icons'
import type { FC } from 'react'
import styles from '../index.less'

const Footer: FC = memo(() => {
  return (
    <Layout.Footer className={styles.footer}>
      briefNull
      <CopyrightOutlined className={styles.copyright} />
      2021 All Rights Reserved
    </Layout.Footer>
  )
})

export default Footer
