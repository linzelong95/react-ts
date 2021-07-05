import React, { memo, useState, useCallback, useEffect, useMemo } from 'react'
import { Layout, Menu, Drawer } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTitle } from '@common/hooks'
import type { FC, ReactNode, Dispatch, SetStateAction } from 'react'
import type { RouteConfig } from '@common/types'
import type { TFunction } from 'react-i18next'
import type { SiderProps } from 'antd/es/layout'
import type { MenuProps } from 'antd/es/menu'
import type { DrawerProps } from 'antd/es/drawer'
import styles from '../index.module.scss'

function getMenuItems(
  routes: RouteConfig[],
  flattedAccessRoutes: RouteConfig[],
  t: TFunction<string>,
): JSX.Element[] {
  return routes?.map((route) => {
    const { path, icon, menuKey } = route
    const enableRoute = flattedAccessRoutes.find((route) => route.path === path)
    if (path === '/' || path.includes('/:') || !enableRoute) return null
    const menuName = t(`menu.${menuKey}`)
    return route.routes?.length ? (
      <Menu.SubMenu key={path} icon={icon} title={menuName}>
        {getMenuItems(route.routes, flattedAccessRoutes, t)}
      </Menu.SubMenu>
    ) : (
      <Menu.Item key={path} icon={icon}>
        {menuName}
      </Menu.Item>
    )
  })
}

interface SideMenuProps {
  basename?: string // 暂时用不到
  routes: RouteConfig[]
  flattedAccessRoutes: Omit<RouteConfig, 'routes'>[]
  isSmallViewPort: boolean
  isMobile: boolean
  menuDrawerVisible: boolean
  onToggleMenuDrawer: Dispatch<SetStateAction<DrawerProps['visible']>>
}

const SideMenu: FC<SideMenuProps> = memo((props) => {
  const {
    routes,
    flattedAccessRoutes,
    isMobile,
    isSmallViewPort,
    menuDrawerVisible,
    onToggleMenuDrawer,
  } = props
  const history = useHistory()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<MenuProps['selectedKeys']>([])
  const [menuOpenKeys, setMenuOpenKeys] = useState<MenuProps['openKeys']>([])
  const enableRoute = flattedAccessRoutes.find((route) => route.path === selectedMenuKeys?.[0])
  useTitle(`${t(`menu.${enableRoute?.menuKey}`)}-briefNull`)
  const [sideCollapsed, setSideCollapsed] = useState<SiderProps['collapsed']>(() => isSmallViewPort)

  const clickMenu = useCallback<MenuProps['onClick']>(
    ({ key }) => {
      if ((key as string).startsWith('http')) {
        window.open(key as string, '_blank')
        return
      }
      history.push(key as string)
    },
    [history],
  )

  const openChangeMenu = useCallback<MenuProps['onOpenChange']>((keys) => {
    setMenuOpenKeys(keys as MenuProps['openKeys'])
  }, [])

  useEffect(() => {
    setSelectedMenuKeys([pathname])
    setMenuOpenKeys(
      pathname
        .split('/')
        .slice(1, -1)
        .reduce((paths, path) => [...paths, `${paths.join('/')}/${path}`], []),
    )
  }, [pathname])

  const menuComponent = useMemo<ReactNode>(
    () => (
      <Menu
        className={styles.menu}
        onClick={clickMenu}
        onOpenChange={openChangeMenu}
        selectedKeys={selectedMenuKeys}
        openKeys={menuOpenKeys}
        theme={isMobile ? 'dark' : 'light'}
        mode="inline"
      >
        {getMenuItems(routes, flattedAccessRoutes, t)}
      </Menu>
    ),
    [
      selectedMenuKeys,
      menuOpenKeys,
      routes,
      flattedAccessRoutes,
      isMobile,
      t,
      clickMenu,
      openChangeMenu,
    ],
  )

  return isMobile ? (
    <Drawer
      width={200}
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
          <img
            src={`${__SERVER_ORIGIN__ || ''}/public/assets/images/logo.png`}
            width={40}
            height={40}
          />
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: 26 }}>briefNull</span>
        </div>
      }
      placement="left"
      closable={false}
      visible={menuDrawerVisible}
      bodyStyle={{ background: '#001529', padding: 0 }}
      headerStyle={{
        background: '#001529',
        borderBottomColor: '#424144',
        padding: '12px 16px 10px 16px',
      }}
      onClose={() => {
        onToggleMenuDrawer(false)
      }}
    >
      {menuComponent}
    </Drawer>
  ) : (
    <Layout.Sider
      collapsible
      theme="light"
      collapsed={sideCollapsed}
      className={styles['body-left']}
      onCollapse={(bool) => {
        setSideCollapsed(bool)
      }}
    >
      {menuComponent}
    </Layout.Sider>
  )
})

export default SideMenu
