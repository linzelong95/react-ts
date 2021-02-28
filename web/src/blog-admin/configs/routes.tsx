import React, { lazy } from 'react'
import { RouteConfig } from '@common/types'
import { AlipayOutlined, ZhihuOutlined } from '@ant-design/icons'

const routes: RouteConfig[] = [
  {
    path: '/reply',
    menuKey: 'reply',
    exact: true,
    component: lazy(() => import(/* webpackPrefetch: true */ '@blog-admin/containers/reply')),
    icon: <AlipayOutlined />,
  },
  {
    path: '/message',
    menuKey: 'message',
    exact: true,
    component: lazy(() => import(/* webpackPrefetch: true */ '@blog-admin/containers/message')),
    // authPoints: ['blog.super_admin-is', 'blog.personal_admin-is'],
    // authOperator: 'or',
    icon: <ZhihuOutlined />,
  },
  {
    path: '/category',
    menuKey: 'category',
    exact: true,
    component: lazy(() => import(/* webpackPrefetch: true */ '@blog-admin/containers/category')),
    icon: <AlipayOutlined />,
  },
  {
    path: '/tag',
    menuKey: 'tag',
    exact: true,
    component: lazy(() => import(/* webpackPrefetch: true */ '@blog-admin/containers/tag')),
    icon: <AlipayOutlined />,
  },
  {
    path: '/',
    menuKey: 'index',
    redirect: '/category',
  },
]

export default routes
