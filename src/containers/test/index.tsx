import React from 'react'
import { connect } from 'react-redux'
import { StoreState } from '@src/store/types'

class Test extends React.Component<{ user: StoreState['user'] }> {
  render(): React.ReactNode {
    return <div>我测试一下{this.props.user?.username}</div>
  }
}

export default connect((state: StoreState) => ({ user: state.user }))(Test)
