import React, { memo, useCallback, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Layout, message, Avatar, Dropdown, Menu, Divider, Input, Modal, Tag } from 'antd'
import {
  TranslationOutlined,
  SearchOutlined,
  BellOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { accountServices } from '@common/services'
import { LocalStorage } from '@common/constants'
import { createLoginAction } from '@common/store/actions'
import LoginForm from './login-form'
import { useLocalStorage } from '@common/hooks'
import { rsa, serialize } from '@common/utils'
import type { StoreState } from '@common/store/types'
import type { FC, Dispatch, SetStateAction } from 'react'
import type { IAccount } from '@common/types'
import type { DrawerProps } from 'antd/es/drawer'
import styles from '../index.module.scss'

interface HeaderProps {
  userInfo: StoreState['user']
  isMobile: boolean
  onLogout: () => void
  onToggleMenuDrawer: Dispatch<SetStateAction<DrawerProps['visible']>>
}

const Header: FC<HeaderProps> = memo((props) => {
  const { userInfo, isMobile, onLogout, onToggleMenuDrawer } = props
  const [loginFormVisible, setLoginFormVisible] = useState<boolean>(false)
  const [isForRegister, setIsForRegister] = useState<boolean>(false)
  const [searchBoxVisible, setSearchBoxVisible] = useState<boolean>(false)
  const searchBoxRef = useRef<Input>(null)
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const [, setAccountLocalStorage] = useLocalStorage<{
    autoLoginMark: boolean
    autoLogin: boolean
  }>(LocalStorage.BLOG_STORE_ACCOUNT)

  const changeLang = useCallback<(event: React.MouseEvent<HTMLElement, MouseEvent>) => void>(() => {
    const nextLang = i18n.language === 'zh-CN' ? 'en' : 'zh-CN'
    i18n.changeLanguage(nextLang)
    message.info(`当前语言已设置为${nextLang === 'zh-CN' ? '中文' : '英文'}`)
  }, [i18n])

  const showLoginForm = useCallback<
    (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, forRegister?: boolean) => void
  >((event, forRegister) => {
    event.preventDefault()
    setLoginFormVisible(true)
    setIsForRegister(Boolean(forRegister))
  }, [])

  const login = useCallback<(params: IAccount['loginParams']) => void>(
    async (params) => {
      const { password, autoLogin, captcha } = params
      message.loading({ content: '正在登录...', key: 'login', duration: 0 })
      const [, verifyCaptchaErr] = await accountServices.verifyCaptcha(captcha)
      if (verifyCaptchaErr) {
        message.error({ content: '验证码错误', key: 'login' })
        return
      }
      const [publicKeyRes, publicKeyErr] = await accountServices.getPublicKey()
      if (publicKeyErr || !publicKeyRes?.data?.item) {
        message.error({ content: '登录失败', key: 'login' })
        return
      }
      const encryptedPassword = rsa(serialize(password), publicKeyRes.data.item)
      const [loginRes, loginErr] = await accountServices.login({
        ...params,
        password: encryptedPassword,
      })
      if (loginErr) {
        message.error({ content: loginErr.message || '登录失败', key: 'login' })
        return
      }
      message.success({ content: '登录成功', key: 'login' })
      setAccountLocalStorage({ autoLogin, autoLoginMark: autoLogin })
      dispatch(createLoginAction(loginRes.data))
    },
    [setAccountLocalStorage, dispatch],
  )

  const register = useCallback<(params: any) => void>(
    async (params) => {
      message.loading({ content: '正在注册...', key: 'register', duration: 0 })
      const [, registerErr] = await accountServices.register(params)
      if (registerErr) {
        message.error({ content: registerErr.message || '注册失败', key: 'register' })
        return
      }
      message.success({ content: '注册成功', key: 'register' })
      login(params)
    },
    [login],
  )

  const goToCenter = useCallback<() => void>(() => {
    Modal.info({ title: '感谢使用，暂未开发' })
  }, [])

  return (
    <Layout.Header className={styles['header-area']}>
      <div className={styles['header-left']}>
        <img
          src={`${__SERVER_ORIGIN__ || ''}/public/assets/images/logo.png`}
          className={styles['site-logo']}
        />
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
        <li>
          <a href="/blog">
            <Tag>blog</Tag>
          </a>
        </li>
        {(!searchBoxVisible || !isMobile) && (
          <>
            <li>
              <BellOutlined />
            </li>
            <li className={styles['login-info']}>
              {userInfo.account ? (
                <Dropdown
                  placement="bottomCenter"
                  overlay={
                    <Menu>
                      <Menu.Item onClick={onLogout}>{t('common.logout')}</Menu.Item>
                      <Menu.Item onClick={goToCenter}>{t('common.myProfile')}</Menu.Item>
                    </Menu>
                  }
                >
                  <Avatar
                    style={{ cursor: 'pointer' }}
                    src={
                      userInfo?.avatar ||
                      `${__SERVER_ORIGIN__ || ''}/public/assets/images/default/avatar.jpeg`
                    }
                  />
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
      {loginFormVisible && (
        <LoginForm
          visible={loginFormVisible}
          isForRegister={isForRegister}
          onLogin={login}
          onRegister={register}
          onClose={() => {
            setLoginFormVisible(false)
          }}
        />
      )}
    </Layout.Header>
  )
})

export default Header
