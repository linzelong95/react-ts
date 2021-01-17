import React from 'react'
import type { FC, PropsWithChildren } from 'react'

const TestA: FC<PropsWithChildren<unknown>> = (props) => {
  return (
    <>
      <div>test-a</div>
      {props.children}
    </>
  )
}

export default TestA
