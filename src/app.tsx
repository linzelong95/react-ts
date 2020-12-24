import React, { useEffect, Dispatch, useCallback } from 'react'
import { connect } from 'react-redux'
import { Icon } from '@common/components'
import { StoreState, UserAction, UserActionType } from '@src/store/types'
import './app.less'
import testImgUrl from '@public/images/haha.jpeg'
import testSvgUrl from '@public/images/mail.svg'
import Test from './containers/test'
import { login } from '@services/user'

interface AppProps {
  user: StoreState['user']
  onClearUser: (flag?: boolean) => void
}

function App(props: AppProps): JSX.Element {
  const a = [1, 3, 5]
  const b = [...a]
  const { user, onClearUser } = props
  console.log(user)

  const logout = useCallback(() => {
    onClearUser()
  }, [])

  useEffect(() => {
    ;(async () => {
      const [res, err] = await login({ email: '984621758@qq.com', password: 'Qq123456' })
      if (err) return
      console.log(res)
    })()
  }, [])

  return (
    <div>
      <Test />
      <h1>我的名字{user.username}</h1>
      <Icon className="map-icon" name="model" width="40px" height="40px" color="#333" />
      <header>
        <p>
          Ed8886 <code>src/App.js</code> and save to reload.{b.join(',')}
        </p>
        <a className="app-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
        <img src={testImgUrl} />
        <div style={{ background: 'black' }}>
          <span style={{ background: `url(${testSvgUrl})`, backgroundSize: '50px 50px' }} />
        </div>
      </header>
      <button onClick={logout}>删除username</button>
    </div>
  )
}

export default connect<Pick<AppProps, 'user'>, Pick<AppProps, 'onClearUser'>, Omit<AppProps, 'user' | 'onClearUser'>, StoreState>(
  (state: StoreState) => ({
    user: state.user,
  }),
  (dispatch: Dispatch<UserAction>) => ({
    onClearUser: (flag?: boolean) => dispatch({ type: UserActionType.LOGOUT, params: { flag } }),
  }),
)(App)
