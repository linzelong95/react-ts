import React, { useEffect, Dispatch, useCallback } from 'react'
import { connect } from 'react-redux'
import { Icon, BasicLayout } from '@common/components'
import { StoreState, UserAction, UserActionType } from '@src/store/types'
import testImgUrl from '@public/images/haha.jpeg'
import testSvgUrl from '@public/images/mail.svg'
import { login } from '@services/user'
import routes from '@configs/routes'
import { renderRoutes } from '@utils/routes'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface AppProps {
  user: StoreState['user']
  onClearUser: (flag?: boolean) => void
}

function App(props: AppProps): JSX.Element {
  const history = useHistory()
  const { t, i18n } = useTranslation()
  const { user, onClearUser } = props
  console.log(user)

  const logout = useCallback(() => {
    onClearUser()
  }, [])

  const changeLang = useCallback(() => {
    console.log(i18n.languages[0])
    i18n.changeLanguage(i18n.languages[0] === 'zh-CN' ? 'en' : 'zh-CN')
  }, [])

  useEffect(() => {
    ;(async () => {
      const [res, err] = await login({ email: '984621758@qq.com', password: 'Qq123456' })
      if (err) return
      console.log(res)
    })()
  }, [])

  return (
    <BasicLayout>
      <div>
        我的名字333{user.username}
        {t('test.name')}
      </div>
      <Icon className="map-icon" name="model" width="40px" height="40px" color="red" />
      <img src={testImgUrl} />
      <div style={{ background: 'black' }}>
        <span style={{ background: `url(${testSvgUrl})`, backgroundSize: '50px 50px' }} />
      </div>
      <button onClick={logout}>删除username</button>
      <button onClick={changeLang}>更换语言</button>
      <br />
      <button onClick={() => history.push('/')}>push /</button>
      <button onClick={() => history.push('/root')}>push /root</button>
      <button onClick={() => history.push('/test-a')}>push /test-a</button>
      <button onClick={() => history.push('/test-a/test-b')}>push /test-a/test-b</button>
      <button onClick={() => history.push('/test-a/f')}>push /test-a/f</button>
      <button onClick={() => history.push('/test-a/test-c')}>push /test-a/test-c</button>
      <button onClick={() => history.push('/c')}>push /c</button>
      <button onClick={() => history.push('/d')}>push /d</button>
      <button onClick={() => history.push('/not-found')}>push /not-found</button>
      {renderRoutes(routes)}
    </BasicLayout>
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
