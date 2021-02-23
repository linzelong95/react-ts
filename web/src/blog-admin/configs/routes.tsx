import React from 'react'
import { RouteConfig } from '@common/types'
import { asyncComponent } from '@common/utils'
import { AlipayOutlined, ZhihuOutlined } from '@ant-design/icons'

const routes: RouteConfig[] = [
  {
    path: '/category',
    menuKey: 'category',
    exact: true,
    component: asyncComponent(() => import(/* webpackPrefetch: true */ '@blog-admin/containers/category')),
    icon: <AlipayOutlined />,
  },
  {
    path: '/message',
    menuKey: 'message',
    exact: true,
    component: asyncComponent(() => import(/* webpackPrefetch: true */ '@blog-admin/containers/message')),
    // authPoints: ['blog.super_admin-is', 'blog.personal_admin-is'],
    // authOperator: 'or',
    icon: <ZhihuOutlined />,
  },
  {
    path: '/',
    menuKey: 'index',
    redirect: '/category',
  },
]

export default routes
