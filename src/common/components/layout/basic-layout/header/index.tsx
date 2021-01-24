import React, { memo, useCallback, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Layout, Button, message, Avatar, Image, Dropdown, Menu, Divider } from 'antd'
import { TranslationOutlined, SearchOutlined, BellOutlined } from '@ant-design/icons'
import logoImg from '@public/images/logo.png'
import { useTranslation } from 'react-i18next'
import { loginServices } from '@services/user'
import { createLogoutAction, createLoginAction } from '@store/actions'
import LoginForm from './login-form'
import { rsa, serialize } from '@common/utils'
import type { StoreState } from '@src/store/types'
import type { FC } from 'react'
import type { LoginParams } from '@services/user/login'
import styles from '../index.less'

const Header: FC = memo(() => {
  const [loginFormVisible, setLoginFormVisible] = useState<boolean>(false)
  const [isForRegister, setIsForRegister] = useState<boolean>(false)
  const { t, i18n } = useTranslation()
  const userInfo = useSelector<StoreState, StoreState['user']>((state) => state.user)
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
      console.log(111, publicKeyRes, publicKeyErr)
      if (publicKeyErr || !publicKeyRes?.data?.item) {
        message.error({ content: '登录失败', key: 'login' })
        return
      }
      const encryptedPassword = rsa(serialize(params.password), publicKeyRes.data.item)
      const [loginRes, loginErr] = await loginServices.login({ ...params, password: encryptedPassword })
      if (loginErr) {
        message.error({ content: loginErr.message || '登录失败', key: 'login' })
        return
      }
      message.success({ content: '登录成功', key: 'login' })
      dispatch(createLoginAction(loginRes.data))
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
    dispatch(createLogoutAction())
  }, [dispatch])

  return (
    <Layout.Header className={styles['header-area']}>
      <div className={styles['header-left']}>
        <img src={logoImg} className={styles['site-logo']} />
        <span className={styles['site-name']}>向上的博客</span>
      </div>
      <div className={styles['header-right']}>
        <SearchOutlined className={styles['search-icon']} />
        <BellOutlined />
        <div className={styles['login-info']}>
          {userInfo.account ? (
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item onClick={logout}>{t('common.logout')}</Menu.Item>
                </Menu>
              }
            >
              <Avatar src={<Image src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />} />
              {userInfo.account}
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
        </div>
        <Button size="small" shape="circle" icon={<TranslationOutlined />} onClick={changeLang} />
      </div>
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
