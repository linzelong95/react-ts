import React, { memo, useState, useCallback, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { Menu, Layout, PageHeader, Button, message } from 'antd'
import { SettingOutlined, TranslationOutlined, SearchOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { WrappedContainer } from '@common/components'
import routes from '@configs/routes'
import logoImg from '@public/images/logo.png'
import type { FC } from 'react'
import type { TFunction } from 'react-i18next'
import type { RouteConfig } from '@src/common/types'
import type { MenuProps } from 'antd/es/menu'
import type { SiderProps } from 'antd/es/layout'
import styles from './index.less'

// 假如当前用户是blog.personal_admin-is
const userAuthPoints: string[] = ['blog.super_admin-is', 'blog.personal_admin-is']

const validFlattedMenus: string[] = []

function getMenu(routes: RouteConfig[], t: TFunction<string>): JSX.Element[] {
  return routes.map((route) => {
    const { path, authPoints, authOperator = 'or' } = route
    if (path === '/') {
      validFlattedMenus.push(path)
      return null
    }
    if (Array.isArray(authPoints)) {
      const isPass: boolean =
        authPoints.length > 0 &&
        ((authOperator === 'or' && userAuthPoints.some((userAuthPoint) => authPoints.includes(userAuthPoint))) ||
          (authOperator === 'and' && authPoints.every((authPoint) => userAuthPoints.includes(authPoint))))
      if (!isPass) return null
    }
    if (route.routes?.length) {
      return (
        <Menu.SubMenu key={path} icon={<SettingOutlined />} title={t(`menu.${path}`)}>
          {getMenu(route.routes, t)}
        </Menu.SubMenu>
      )
    }
    validFlattedMenus.push(path)
    return <Menu.Item key={path}>{t(`menu.${path}`)}</Menu.Item>
  })
}

const BasicLayout: FC = memo((props) => {
  const { children } = props
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()
  const history = useHistory()

  const [sideCollapsed, setSideCollapsed] = useState<SiderProps['collapsed']>(false)

  const [selectedMenuKeys, setSelectedMenuKeys] = useState<MenuProps['selectedKeys']>([])
  const [menuOpenKeys, setMenuOpenKeys] = useState<MenuProps['openKeys']>([])

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
            {getMenu(routes, t)}
          </Menu>
        </Layout.Sider>
        <Layout className={styles['body-right']}>
          <Layout.Content className={styles['main-content']}>
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
            <WrappedContainer>{children}</WrappedContainer>
          </Layout.Content>
          <Layout.Footer className={styles.footer}>Layout.Footer</Layout.Footer>
        </Layout>
      </Layout>
    </Layout>
  )
})

export { BasicLayout }
