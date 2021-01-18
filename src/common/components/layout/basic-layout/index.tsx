import React, { useMemo, memo, useState, useCallback } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { Menu } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import routes from '@configs/routes'
import type { FC } from 'react'
import { MenuProps } from 'antd/es/menu'

const { SubMenu } = Menu

function getMenu(routes, t): JSX.Element {
  return routes.map((route) => {
    const { path } = route
    if (!route.routes?.length) return <Menu.Item key={path}>{t(`menu.${path}`)}</Menu.Item>
    return (
      <SubMenu key={path} icon={<SettingOutlined />} title={t(`menu.${path}`)}>
        {getMenu(route.routes, t)}
      </SubMenu>
    )
  })
}

const BasicLayout: FC = memo((props) => {
  const { children } = props
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const history = useHistory()

  const [selectedMenuKeys, setSelectedMenuKeys] = useState<MenuProps['selectedKeys']>(() => [pathname])
  const [menuOpenKeys, setMenuOpenKeys] = useState<MenuProps['openKeys']>(() =>
    pathname
      .split('/')
      .slice(1, -1)
      .reduce((paths, path) => [...paths, `${paths.join('/')}/${path}`], []),
  )

  const clickMenu = useCallback<MenuProps['onClick']>(
    ({ key }) => {
      setSelectedMenuKeys([key as string])
      history.push(key as string)
    },
    [history],
  )

  const openChangeMenu = useCallback<MenuProps['onOpenChange']>((keys) => {
    setMenuOpenKeys(keys as MenuProps['openKeys'])
  }, [])

  const menuComponent = useMemo(() => {
    return (
      <Menu
        onClick={clickMenu}
        onOpenChange={openChangeMenu}
        style={{ width: 256 }}
        selectedKeys={selectedMenuKeys}
        openKeys={menuOpenKeys}
        mode="inline"
      >
        {getMenu(routes, t)}
      </Menu>
    )
  }, [t, clickMenu, openChangeMenu, menuOpenKeys, selectedMenuKeys])

  return (
    <>
      {menuComponent}
      {children}
    </>
  )
})

export { BasicLayout }
