import React, { lazy } from 'react'
import { BasicLayout } from '@common/components'
import { AlipayOutlined, ZhihuOutlined } from '@ant-design/icons'
import type { RouteConfig } from '@common/types'

const routes: RouteConfig[] = [
  {
    path: '/',
    menuKey: 'index',
    redirect: '/reply',
    component: BasicLayout,
    routes: [
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
    ],
  },
]

export default routes
