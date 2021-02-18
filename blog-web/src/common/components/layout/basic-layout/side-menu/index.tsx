import React, { memo, useState, useCallback, useEffect, useMemo } from 'react'
import { Layout, Menu, Drawer } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTitle } from '@common/hooks'
import logoImg from '@blog-admin/public/images/logo.png'
import type { FC, ReactNode, Dispatch, SetStateAction } from 'react'
import type { RouteConfig } from '@src/common/types'
import type { TFunction } from 'react-i18next'
import type { SiderProps } from 'antd/es/layout'
import type { MenuProps } from 'antd/es/menu'
import type { DrawerProps } from 'antd/es/drawer'
import styles from '../index.less'

function getMenuItems(routes: RouteConfig[], enablePaths: string[], t: TFunction<string>): JSX.Element[] {
  return routes?.map((route) => {
    const { path, icon } = route
    if (path === '/' || path.includes('/:') || !enablePaths.includes(path)) return null
    return route.routes?.length ? (
      <Menu.SubMenu key={path} icon={icon} title={t(`menu.${path}`)}>
        {getMenuItems(route.routes, enablePaths, t)}
      </Menu.SubMenu>
    ) : (
      <Menu.Item key={path} icon={icon}>
        {t(`menu.${path}`)}
      </Menu.Item>
    )
  })
}

interface SideMenuProps {
  routes: RouteConfig[]
  paths: string[]
  isSmallViewPort: boolean
  isMobile: boolean
  menuDrawerVisible: boolean
  onToggleMenuDrawer: Dispatch<SetStateAction<DrawerProps['visible']>>
}

const SideMenu: FC<SideMenuProps> = memo((props) => {
  const { routes, paths, isMobile, isSmallViewPort, menuDrawerVisible, onToggleMenuDrawer } = props
  const history = useHistory()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<MenuProps['selectedKeys']>([])
  const [menuOpenKeys, setMenuOpenKeys] = useState<MenuProps['openKeys']>([])
  useTitle(t(`menu.${selectedMenuKeys[0]}`))
  const [sideCollapsed, setSideCollapsed] = useState<SiderProps['collapsed']>(() => isSmallViewPort)

  console.log(111, pathname, history)

  const clickMenu = useCallback<MenuProps['onClick']>(
    ({ key }) => {
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
        {getMenuItems(routes, paths, t)}
      </Menu>
    ),
    [selectedMenuKeys, menuOpenKeys, routes, paths, isMobile, t, clickMenu, openChangeMenu],
  )

  return isMobile ? (
    <Drawer
      width={200}
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
          <img src={logoImg} width={40} height={40} />
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: 26 }}>briefNull</span>
        </div>
      }
      placement="left"
      closable={false}
      visible={menuDrawerVisible}
      bodyStyle={{ background: '#001529', padding: 0 }}
      headerStyle={{ background: '#001529', borderBottomColor: '#424144', padding: '12px 16px 10px 16px' }}
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
