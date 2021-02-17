import React, { useEffect } from 'react'
import type { FC } from 'react'

const TestA: FC<unknown> = (props) => {
  useEffect(() => {
    console.log('test-a', props)
  }, [props])
  return <div>test-a {props?.children}</div>
}

export default TestA
