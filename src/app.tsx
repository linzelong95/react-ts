import React, { useEffect, Dispatch, useCallback } from 'react'
import { connect } from 'react-redux'
import { Icon } from '@common/components'
import { StoreState, UserAction, UserActionType } from '@src/store/types'
import './app.less'
import testImgUrl from '@public/images/haha.jpeg'
import testSvgUrl from '@public/images/mail.svg'
import { login } from '@services/user'
import routes from '@configs/routes'
import { renderRoutes } from '@utils/routes'
import { useHistory } from 'react-router-dom'
interface AppProps {
  user: StoreState['user']
  onClearUser: (flag?: boolean) => void
}

function App(props: AppProps): JSX.Element {
  const history = useHistory()
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
      <h1>我的名字{user.username}</h1>
      <Icon className="map-icon" name="model" width="40px" height="40px" color="#333" />
      <img src={testImgUrl} />
      <div style={{ background: 'black' }}>
        <span style={{ background: `url(${testSvgUrl})`, backgroundSize: '50px 50px' }} />
      </div>
      <button onClick={logout}>删除username</button>
      <button onClick={() => history.push('/')}>push /</button>
      <button onClick={() => history.push('/test-a')}>push /test-a</button>
      <button onClick={() => history.push('/test-a/test-b')}>push /test-a/test-b</button>
      <button onClick={() => history.push('/test-a/f')}>push /test-a/f</button>
      <button onClick={() => history.push('/test-a/test-c')}>push /test-a/test-c</button>
      <button onClick={() => history.push('/c')}>push /c</button>
      <button onClick={() => history.push('/d')}>push /d</button>
      <button onClick={() => history.push('/not-found')}>push /not-found</button>
      {renderRoutes(routes)}
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
