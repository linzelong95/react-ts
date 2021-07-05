import { memo, useCallback, useMemo, useState, useEffect } from 'react'
import { useLocation, useRouteMatch } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import * as Sentry from '@sentry/browser'
import { Layout, Spin, message } from 'antd'
import { LocalStorage } from '@common/constants'
import { createLoginAction } from '@common/store/actions'
import { accountServices } from '@common/services'
import { Forbidden } from '@common/components'
import { flatRoutes } from '@common/utils'
import { useMobile, useLocalStorage } from '@common/hooks'
import Header from './header'
import Footer from './footer'
import SideMenu from './side-menu'
import type { FC } from 'react'
import type { RouteComponentProps } from 'react-router'
import type { DrawerProps } from 'antd/es/drawer'
import type { StoreState } from '@common/store/types'
import type { RouteConfig } from '@common/types'
import styles from './index.module.scss'

interface BasicLayoutProps extends RouteComponentProps<Record<string, never>> {
  routes?: RouteConfig[]
  basename?: string
  hideAll?: boolean
  hideHeader?: boolean // 优先级高于hideAll
  hideMenu?: boolean // 优先级高于hideAll
  hideFooter?: boolean // 优先级高于hideAll
}

const BasicLayout: FC<BasicLayoutProps> = memo((props) => {
  const { routes = [], basename = '/', children, hideAll = window.top !== window.self } = props
  const { hideHeader = hideAll, hideMenu = hideAll, hideFooter = hideAll } = props
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const userInfo = useSelector<StoreState, StoreState['user']>((state) => state.user)
  // userInfo = {
  //   account: 'ssss',
  //   nickname: 'CCCC',
  //   id: 1,
  //   roleName: 'user',
  //   avatar: '',
  // }
  const isSmallViewPort = useMobile({ includePad: true, includeTraditionalSmallViewPort: 767 })
  const isMobile = useMobile({ includeTraditionalSmallViewPort: true })
  const [menuDrawerVisible, setMenuDrawerVisible] = useState<DrawerProps['visible']>(false)

  const [accountLocalStorage, setAccountLocalStorage] = useLocalStorage<{
    autoLoginMark: boolean
    autoLogin: boolean
  }>(LocalStorage.BLOG_STORE_ACCOUNT)

  const { toHideHeader, toHideMenu, toHideFooter } = useMemo<{
    toHideHeader: boolean
    toHideMenu: boolean
    toHideFooter: boolean
  }>(() => {
    const queries = new URLSearchParams(location.search)
    return {
      toHideHeader: queries.has('hideHeader') || queries.has('hideAll') || hideHeader,
      toHideMenu: queries.has('hideMenu') || queries.has('hideAll') || hideMenu,
      toHideFooter: queries.has('hideFooter') || queries.has('hideAll') || hideFooter,
    }
  }, [hideHeader, hideMenu, hideFooter])

  const getUserAuthPoints = useCallback<() => string[]>(() => {
    if (!userInfo?.roleName) return []
    return userInfo.roleName === 'admin' ? ['blog.super_admin-is'] : ['blog.personal_admin-is']
  }, [userInfo])

  const { flattedRoutes, flattedAccessRoutes } = useMemo<
    Record<'flattedRoutes' | 'flattedAccessRoutes', Omit<RouteConfig, 'routes'>[]>
  >(() => {
    const authPoints = getUserAuthPoints()
    return {
      flattedRoutes: flatRoutes(routes),
      flattedAccessRoutes: flatRoutes(routes, authPoints),
    }
  }, [routes, getUserAuthPoints])

  const match = useRouteMatch(flattedRoutes.map((route) => route.path))

  const isForbidden = useMemo<boolean>(() => {
    return Boolean(match) && flattedAccessRoutes.every((route) => route.path !== pathname)
  }, [pathname, flattedAccessRoutes, match])

  const logout = useCallback<() => void>(async () => {
    const [, err] = await accountServices.logout()
    if (err) {
      message.error('退出登录失败')
      return
    }
    setAccountLocalStorage({ ...accountLocalStorage, autoLoginMark: false })
    const redirectUrl = encodeURIComponent(window.location.href)
    window.location.href = `/account/login?redirect=${redirectUrl}`
  }, [accountLocalStorage, setAccountLocalStorage])

  useEffect(() => {
    if (userInfo?.account) return
    ;(async () => {
      const [loginRes] = await accountServices.login({ autoLogin: true })
      if (!loginRes?.data?.account) {
        const redirectUrl = encodeURIComponent(window.location.href)
        window.location.href = `/account/login?redirect=${redirectUrl}`
        return
      }
      dispatch(createLoginAction(loginRes.data))
    })()
  }, [userInfo, dispatch])

  useEffect(() => {
    if (__IS_DEV_MODE__) return
    Sentry.setUser({ username: userInfo?.account })
  }, [userInfo])

  return (
    <Layout className={styles['basic-layout']}>
      {userInfo?.account ? (
        <>
          {!toHideHeader && (
            <Header
              userInfo={userInfo}
              isMobile={isMobile}
              onLogout={logout}
              onToggleMenuDrawer={setMenuDrawerVisible}
            />
          )}
          <Layout className={styles['body-area']}>
            {!toHideMenu && (
              <SideMenu
                routes={routes}
                basename={basename}
                flattedAccessRoutes={flattedAccessRoutes}
                isMobile={isMobile}
                isSmallViewPort={isSmallViewPort}
                menuDrawerVisible={menuDrawerVisible}
                onToggleMenuDrawer={setMenuDrawerVisible}
              />
            )}
            <Layout className={styles['body-right']}>
              <Layout.Content className={styles['main-content']}>
                {isForbidden ? <Forbidden /> : children}
              </Layout.Content>
              {!toHideFooter && <Footer />}
            </Layout>
          </Layout>
        </>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" />
        </div>
      )}
    </Layout>
  )
})

export default BasicLayout
