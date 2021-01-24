import React, { memo, useState, useCallback, useEffect, useMemo } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { Menu, Layout, PageHeader } from 'antd'
import { WrappedContainer, Forbidden } from '@common/components'
import Header from './header'
import routes from '@configs/routes'
import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import type { TFunction } from 'react-i18next'
import type { RouteConfig } from '@src/common/types'
import type { MenuProps } from 'antd/es/menu'
import type { SiderProps } from 'antd/es/layout'
import styles from './index.less'

function getMenuItems(routes: RouteConfig[], flattedPathsWithPermission: string[], t: TFunction<string>): JSX.Element[] {
  return routes.map((route) => {
    const { path, icon } = route
    if (path === '/' || path.includes('/:') || !flattedPathsWithPermission.includes(path)) return null
    return route.routes?.length ? (
      <Menu.SubMenu key={path} icon={icon} title={t(`menu.${path}`)}>
        {getMenuItems(route.routes, flattedPathsWithPermission, t)}
      </Menu.SubMenu>
    ) : (
      <Menu.Item key={path} icon={icon}>
        {t(`menu.${path}`)}
      </Menu.Item>
    )
  })
}

function getFlattedPaths(routes: RouteConfig[] = [], userAuthPoints?: string[]): string[] {
  return routes.reduce((flattedPaths, route) => {
    const { path, authPoints, authOperator = 'or' } = route
    if (Array.isArray(authPoints) && Array.isArray(userAuthPoints)) {
      const isPass: boolean =
        (authOperator === 'or' && userAuthPoints.some((userAuthPoint) => authPoints.includes(userAuthPoint))) ||
        (authOperator === 'and' && authPoints.length > 0 && authPoints.every((authPoint) => userAuthPoints.includes(authPoint)))
      if (!isPass) return flattedPaths
    }
    flattedPaths = [...flattedPaths, path, ...getFlattedPaths(route.routes, userAuthPoints)]
    return flattedPaths
  }, [])
}

const BasicLayout: FC = memo((props) => {
  const { children } = props
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const history = useHistory()

  // 假如当前用户是blog.personal_admin-is,这一部分应该从userInfo获取
  const userAuthPoints: string[] = useMemo(() => ['blog.personal_admin-is'], [])

  const [sideCollapsed, setSideCollapsed] = useState<SiderProps['collapsed']>(false)

  const [selectedMenuKeys, setSelectedMenuKeys] = useState<MenuProps['selectedKeys']>([])
  const [menuOpenKeys, setMenuOpenKeys] = useState<MenuProps['openKeys']>([])

  const { isNotFound, isForbidden, flattedPathsWithPermission } = useMemo<{
    isForbidden: boolean
    isNotFound: boolean
    flattedPathsWithPermission: string[]
  }>(() => {
    const allFlattedPaths = getFlattedPaths(routes)
    const flattedPathsWithPermission = getFlattedPaths(routes, userAuthPoints)
    // TODO:动态路由的处理
    const isNotFound = !allFlattedPaths.includes(pathname)
    const isForbidden = !isNotFound && !flattedPathsWithPermission.includes(pathname)
    return { isNotFound, isForbidden, flattedPathsWithPermission }
  }, [userAuthPoints, pathname])

  useEffect(() => {
    setSelectedMenuKeys([pathname])
    setMenuOpenKeys(
      pathname
        .split('/')
        .slice(1, -1)
        .reduce((paths, path) => [...paths, `${paths.join('/')}/${path}`], []),
    )
  }, [pathname])

  const clickMenu = useCallback<MenuProps['onClick']>(
    ({ key }) => {
      history.push(key as string)
    },
    [history],
  )

  const openChangeMenu = useCallback<MenuProps['onOpenChange']>((keys) => {
    setMenuOpenKeys(keys as MenuProps['openKeys'])
  }, [])

  return (
    <Layout className={styles['basic-layout']}>
      <Header />
      <Layout className={styles['body-area']}>
        <Layout.Sider
          collapsible
          theme="light"
          collapsed={sideCollapsed}
          className={styles['body-left']}
          onCollapse={(bool) => {
            setSideCollapsed(bool)
          }}
        >
          <Menu
            className={styles.menu}
            onClick={clickMenu}
            onOpenChange={openChangeMenu}
            selectedKeys={selectedMenuKeys}
            openKeys={menuOpenKeys}
            mode="inline"
          >
            {getMenuItems(routes, flattedPathsWithPermission, t)}
          </Menu>
        </Layout.Sider>
        <Layout className={styles['body-right']}>
          <Layout.Content className={styles['main-content']}>
            {!isNotFound && !isForbidden && (
              <PageHeader
                title={t(`menu.${selectedMenuKeys[0]}`)}
                subTitle="This is a subtitle"
                ghost={false}
                breadcrumb={{
                  // TODO:如果点击的是可扩展节点，面包屑不应该更新
                  routes: [...menuOpenKeys, ...selectedMenuKeys].map((path, index) => ({
                    path: pathname.split('/')[index + 1],
                    breadcrumbName: t(`menu.${path}`),
                  })),
                }}
              >
                自定义内容
              </PageHeader>
            )}
            <WrappedContainer style={{ marginBottom: 0 }}>{isForbidden ? <Forbidden /> : children}</WrappedContainer>
          </Layout.Content>
          <Layout.Footer className={styles.footer}>Layout.Footer</Layout.Footer>
        </Layout>
      </Layout>
    </Layout>
  )
})

export { BasicLayout }
