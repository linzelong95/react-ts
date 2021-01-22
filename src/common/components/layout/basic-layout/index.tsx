import React, { memo, useState, useCallback, useEffect, useMemo } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { Menu, Layout, PageHeader, Button, message } from 'antd'
import { TranslationOutlined, SearchOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { WrappedContainer, Forbidden } from '@common/components'
import routes from '@configs/routes'
import logoImg from '@public/images/logo.png'
import type { FC } from 'react'
import type { TFunction } from 'react-i18next'
import type { RouteConfig } from '@src/common/types'
import type { MenuProps } from 'antd/es/menu'
import type { SiderProps } from 'antd/es/layout'
import styles from './index.less'

// 假如当前用户是blog.personal_admin-is
const userAuthPoints: string[] = ['blog.personal_admin-is']

function getMenuItems(routes: RouteConfig[], flattedPathsWithPermission: string[], t: TFunction<string>): JSX.Element[] {
  return routes.map((route) => {
    const { path, icon } = route
    if (path === '/' || !flattedPathsWithPermission.includes(path)) return null
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
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()
  const history = useHistory()

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
    const isNotFound = !allFlattedPaths.includes(pathname)
    const isForbidden = !isNotFound && !flattedPathsWithPermission.includes(pathname)
    return { isNotFound, isForbidden, flattedPathsWithPermission }
  }, [routes, userAuthPoints, pathname, getFlattedPaths])

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
    [history?.push],
  )

  const openChangeMenu = useCallback<MenuProps['onOpenChange']>((keys) => {
    setMenuOpenKeys(keys as MenuProps['openKeys'])
  }, [])

  const changeLang = useCallback<(event: React.MouseEvent<HTMLElement, MouseEvent>) => void>(() => {
    const nextLang: 'en' | 'zh-CN' = i18n.languages[0] === 'zh-CN' ? 'en' : 'zh-CN'
    i18n.changeLanguage(nextLang)
    message.info(`当前语言已设置为${nextLang === 'zh-CN' ? '中文' : '英文'}`)
  }, [i18n?.changeLanguage, i18n?.languages?.[0]])

  return (
    <Layout className={styles['basic-layout']}>
      <Layout.Header className={styles['header-area']}>
        <div className={styles['header-left']}>
          <img src={logoImg} className={styles['site-logo']} />
          <span className={styles['site-name']}>向上的博客</span>
        </div>
        <div className={styles['header-right']}>
          <SearchOutlined className={styles['search-icon']} />
          <Button size="small" shape="circle" icon={<TranslationOutlined />} onClick={changeLang} />
        </div>
      </Layout.Header>
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
