import React, { memo, useCallback, useMemo, useState } from 'react'
import { useLocation, useRouteMatch } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Layout } from 'antd'
import { Forbidden } from '@common/components'
import { flatRoutes } from '@common/utils'
import { useMobile } from '@common/hooks'
import Header from './header'
import Footer from './footer'
import SideMenu from './side-menu'
import type { FC } from 'react'
import type { DrawerProps } from 'antd/es/drawer'
import type { StoreState } from '@common/store/types'
import type { RouteConfig } from '@common/types'
import styles from './index.less'

const BasicLayout: FC<{ routes?: RouteConfig[]; basename: string }> = memo((props) => {
  const { routes, basename, children } = props
  const { pathname } = useLocation()
  const userInfo = useSelector<StoreState, StoreState['user']>((state) => state.user)
  const isSmallViewPort = useMobile({ includePad: true, includeTraditionalSmallViewPort: 767 })
  const isMobile = useMobile({ includeTraditionalSmallViewPort: true })
  const [menuDrawerVisible, setMenuDrawerVisible] = useState<DrawerProps['visible']>(false)

  const getUserAuthPoints = useCallback<() => string[]>(() => {
    if (!userInfo?.roleName) return []
    return userInfo.roleName === 'admin' ? ['blog.super_admin-is'] : ['blog.personal_admin-is']
  }, [userInfo])

  const { flattedRoutes, flattedAccessRoutes } = useMemo<
    Record<'flattedRoutes' | 'flattedAccessRoutes', Omit<RouteConfig, 'routes'>[]>
  >(() => {
    const authPoints = getUserAuthPoints()
    return { flattedRoutes: flatRoutes(routes), flattedAccessRoutes: flatRoutes(routes, authPoints) }
  }, [routes, getUserAuthPoints])

  const match = useRouteMatch(flattedRoutes.map((route) => route.path))

  const isForbidden = useMemo<boolean>(() => {
    return Boolean(match) && flattedAccessRoutes.every((route) => route.path !== pathname)
  }, [pathname, flattedAccessRoutes, match])

  return (
    <Layout className={styles['basic-layout']}>
      <Header userInfo={userInfo} isMobile={isMobile} onToggleMenuDrawer={setMenuDrawerVisible} />
      <Layout className={styles['body-area']}>
        <SideMenu
          routes={routes}
          basename={basename}
          flattedAccessRoutes={flattedAccessRoutes}
          isMobile={isMobile}
          isSmallViewPort={isSmallViewPort}
          menuDrawerVisible={menuDrawerVisible}
          onToggleMenuDrawer={setMenuDrawerVisible}
        />
        <Layout className={styles['body-right']}>
          <Layout.Content className={styles['main-content']}>{isForbidden ? <Forbidden /> : children}</Layout.Content>
          <Footer />
        </Layout>
      </Layout>
    </Layout>
  )
})

export { BasicLayout }
