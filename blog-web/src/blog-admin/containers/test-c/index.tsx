import React from 'react'
import { useHistory, useParams, useLocation } from 'react-router-dom'
import type { FC } from 'react'

const TestC: FC = () => {
  const history = useHistory()
  const params = useParams()
  const location = useLocation()
  console.log(history, params, location)

  return (
    <>
      <div>test-c 222</div>
    </>
  )
}

export default TestC
