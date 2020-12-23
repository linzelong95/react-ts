import React, { memo, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { StoreState } from '@src/store/types'
import { getSomethingList } from '@services/test'
import { GetSomethingListRes } from '@type/test'

interface TestProps {
  user: StoreState['user']
}

const Test = (props: TestProps) => {
  const [dataSource, setDataSource] = useState<string[]>([])

  useEffect(() => {
    ;(async () => {
      const [res, err] = await getSomethingList<GetSomethingListRes>('haha')
      console.log(err)
      if (err) {
        alert('请求异常')
        return
      }
      const {
        data: { list },
      } = res
      setDataSource(list)
    })()
  }, [])

  return (
    <>
      <div>我测试一下{props.user?.username}</div>
      <div>{dataSource.join(',')}</div>
      <button>点我发起请求</button>
    </>
  )
}

export default connect<Pick<TestProps, 'user'>, null, Omit<TestProps, 'user'>, StoreState>((state: StoreState) => ({ user: state.user }))(memo(Test))
