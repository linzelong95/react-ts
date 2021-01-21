import React, { memo, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { StoreState } from '@src/store/types'
import { getSomethingList } from '@services/test'
import { GetSomethingListRes } from '@type/test'
import type { FC } from 'react'

interface TestProps {
  user: StoreState['user']
}

const Test: FC<TestProps> = (props) => {
  const [dataSource, setDataSource] = useState<GetSomethingListRes['list']>([])

  useEffect(() => {
    ;(async () => {
      const [res, err] = await getSomethingList('haha')
      if (err) {
        console.log(err)
        alert('请求异常')
        return
      }
      const {
        data: { list },
      } = res
      setDataSource(list)
    })()
  }, [])

  console.log('children', props)

  return (
    <>
      <div>我测试一下{props.user?.username}</div>
      <div>{dataSource.join(',')}</div>
      <button>点我发起请求</button>
      {props.children}
    </>
  )
}

export default connect<Pick<TestProps, 'user'>, null, Omit<TestProps, 'user'>, StoreState>((state: StoreState) => ({ user: state.user }))(
  memo(Test),
)
