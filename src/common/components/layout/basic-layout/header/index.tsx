import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Layout, message, Avatar, Dropdown, Menu, Divider, Input } from 'antd'
import { TranslationOutlined, SearchOutlined, BellOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import logoImg from '@public/images/logo.png'
import { useTranslation } from 'react-i18next'
import { loginServices } from '@services/user'
import { createLogoutAction, createLoginAction } from '@store/actions'
import LoginForm from './login-form'
import { rsa, serialize } from '@common/utils'
import type { StoreState } from '@src/store/types'
import type { FC, Dispatch, SetStateAction } from 'react'
import type { LoginParams } from '@services/user/login'
import type { DrawerProps } from 'antd/es/drawer'
import styles from '../index.less'

interface HeaderProps {
  userInfo: StoreState['user']
  isMobile: boolean
  onToggleMenuDrawer: Dispatch<SetStateAction<DrawerProps['visible']>>
}

const Header: FC<HeaderProps> = memo((props) => {
  const { userInfo, isMobile, onToggleMenuDrawer } = props
  const [loginFormVisible, setLoginFormVisible] = useState<boolean>(false)
  const [isForRegister, setIsForRegister] = useState<boolean>(false)
  const [searchBoxVisible, setSearchBoxVisible] = useState<boolean>(false)
  const searchBoxRef = useRef<Input>(null)
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()

  const changeLang = useCallback<(event: React.MouseEvent<HTMLElement, MouseEvent>) => void>(() => {
    const nextLang = i18n.languages[0] === 'zh-CN' ? 'en' : 'zh-CN'
    i18n.changeLanguage(nextLang)
    message.info(`当前语言已设置为${nextLang === 'zh-CN' ? '中文' : '英文'}`)
  }, [i18n])

  const showLoginForm = useCallback<(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, forRegister?: boolean) => void>(
    (event, forRegister) => {
      event.preventDefault()
      setLoginFormVisible(true)
      setIsForRegister(Boolean(forRegister))
    },
    [],
  )

  const login = useCallback<(params: LoginParams) => void>(
    async (params) => {
      message.loading({ content: '正在登录...', key: 'login' })
      const [publicKeyRes, publicKeyErr] = await loginServices.getPublicKey()
      if (publicKeyErr || !publicKeyRes?.data?.item) {
        message.error({ content: '登录失败', key: 'login' })
        return
      }
      const { password, autoLogin } = params
      const encryptedPassword = rsa(serialize(password), publicKeyRes.data.item)
      const [loginRes, loginErr] = await loginServices.login({ ...params, password: encryptedPassword })
      if (loginErr) {
        message.error({ content: loginErr.message || '登录失败', key: 'login' })
        return
      }
      message.success({ content: '登录成功', key: 'login' })
      dispatch(createLoginAction(loginRes.data))
      localStorage.setItem('BLOG_STORE_ACCOUNT', JSON.stringify({ autoLogin, autoLoginMark: autoLogin }))
    },
    [dispatch],
  )

  const register = useCallback<(params: any) => void>(
    (params) => {
      login(params)
    },
    [login],
  )

  const logout = useCallback<() => void>(async () => {
    const [, err] = await loginServices.logout()
    if (err) {
      message.error('退出登录失败')
      return
    }
    let blogStoreAccountInfo: { autoLoginMark: boolean; autoLogin: boolean }
    try {
      blogStoreAccountInfo = JSON.parse(localStorage.getItem('BLOG_STORE_ACCOUNT') || '{}')
    } catch {}
    localStorage.setItem('BLOG_STORE_ACCOUNT', JSON.stringify({ ...blogStoreAccountInfo, autoLoginMark: false }))
    dispatch(createLogoutAction())
  }, [dispatch])

  useEffect(() => {
    ;(async () => {
      let blogStoreAccountInfo: { autoLoginMark: boolean; autoLogin: boolean }
      try {
        blogStoreAccountInfo = JSON.parse(localStorage.getItem('BLOG_STORE_ACCOUNT') || '{}')
      } catch {}
      if (blogStoreAccountInfo?.autoLoginMark) {
        const [loginRes] = await loginServices.login({ autoLogin: true })
        if (loginRes?.data) dispatch(createLoginAction(loginRes.data))
      }
    })()
  }, [dispatch])

  return (
    <Layout.Header className={styles['header-area']}>
      <div className={styles['header-left']}>
        <img src={logoImg} className={styles['site-logo']} />
        {isMobile ? (
          <MenuUnfoldOutlined
            style={{ fontSize: 20, marginLeft: 8 }}
            onClick={() => {
              onToggleMenuDrawer(true)
            }}
          />
        ) : (
          <span className={styles['site-name']}>briefNull</span>
        )}
      </div>
      <ul className={styles['header-right']}>
        <li>
          {searchBoxVisible ? (
            <Input
              ref={searchBoxRef}
              placeholder="Enter something"
              prefix={<SearchOutlined />}
              onBlur={() => {
                setSearchBoxVisible(false)
              }}
            />
          ) : (
            <SearchOutlined
              onClick={() => {
                setSearchBoxVisible(true)
                setTimeout(() => {
                  searchBoxRef.current?.focus?.()
                }, 50)
              }}
            />
          )}
        </li>
        {(!searchBoxVisible || !isMobile) && (
          <>
            <li>
              <BellOutlined />
            </li>
            <li className={styles['login-info']}>
              {userInfo.account ? (
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item onClick={logout}>{t('common.logout')}</Menu.Item>
                    </Menu>
                  }
                >
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                </Dropdown>
              ) : (
                <>
                  <a className={styles['log-in']} onClick={(e) => showLoginForm(e)}>
                    {t('common.login')}
                  </a>
                  <Divider type="vertical" className={styles['vertical-divider']} />
                  <a className={styles['log-out']} onClick={(e) => showLoginForm(e, true)}>
                    {t('common.register')}
                  </a>
                </>
              )}
            </li>
          </>
        )}
        <li>
          <TranslationOutlined onClick={changeLang} />
        </li>
      </ul>
      <LoginForm
        visible={loginFormVisible}
        isForRegister={isForRegister}
        onLogin={login}
        onRegister={register}
        onClose={() => {
          setLoginFormVisible(false)
        }}
      />
    </Layout.Header>
  )
})

export default Header
