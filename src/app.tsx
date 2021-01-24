/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, Dispatch, useCallback } from 'react'
import { connect } from 'react-redux'
import { ConfigProvider } from 'antd'
import { Icon, BasicLayout } from '@common/components'
import { StoreState, UserAction, UserActionType } from '@src/store/types'
import testSvgUrl from '@public/images/mail.svg'
import routes from '@configs/routes'
import { renderRoutes } from '@utils/routes'
import { useHistory } from 'react-router-dom'
import enUS from 'antd/lib/locale/en_US'
import zhCN from 'antd/lib/locale/zh_CN'
import { useTranslation } from 'react-i18next'

interface AppProps {
  user: StoreState['user']
  onClearUser: (flag?: boolean) => void
}

function App(props: AppProps): JSX.Element {
  // const history = useHistory()
  const { user, onClearUser } = props

  const { i18n } = useTranslation()

  // const logout = useCallback(() => {
  //   onClearUser()
  // }, [])

  return (
    <ConfigProvider locale={i18n.languages[0] === 'zh-CN' ? zhCN : enUS}>
      <BasicLayout>
        {/* <div>我的名字333{user.username}</div>
      <Icon className="map-icon" name="model" width="40px" height="40px" color="red" />
      <div style={{ height: 60, width: '100%', background: `url(${testSvgUrl})`, backgroundSize: '50px 50px' }}></div>
      <button onClick={logout}>删除username</button>
      <button onClick={() => history.push('/')}>push /</button>
      <button onClick={() => history.push('/root')}>push /root</button>
      <button onClick={() => history.push('/root/test-a')}>push /test-a</button>
      <button onClick={() => history.push('/root/test-a/test-b')}>push /test-a/test-b</button>
      <button onClick={() => history.push('/root/test-a/f')}>push /test-a/f</button>
      <button onClick={() => history.push('/root/test-a/test-c')}>push /test-a/test-c</button>
      <button onClick={() => history.push('/c')}>push /c</button>
      <button onClick={() => history.push('/d')}>push /d</button>
      <button onClick={() => history.push('/not-found')}>push /not-found</button> */}
        {renderRoutes(routes)}
      </BasicLayout>
    </ConfigProvider>
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
