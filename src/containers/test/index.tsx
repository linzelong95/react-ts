import React, { memo, useEffect } from 'react'
import { connect } from 'react-redux'
import { StoreState } from '@src/store/types'
import type { FC } from 'react'

interface TestProps {
  user: StoreState['user']
}

const Test: FC<TestProps> = (props) => {
  useEffect(() => {
    console.log('children', props)
  }, [props])

  return (
    <>
      <div>我测试一下{props.user?.username}</div>
      {props.children}
    </>
  )
}

export default connect<Pick<TestProps, 'user'>, null, Omit<TestProps, 'user'>, StoreState>((state: StoreState) => ({ user: state.user }))(
  memo(Test),
)
