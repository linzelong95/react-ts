import React, { lazy } from 'react'
import { BasicLayout } from '@spa/common/components'
import { AlipayOutlined, ZhihuOutlined } from '@ant-design/icons'
import type { RouteConfig } from '@common/types'

const routes: RouteConfig[] = [
  {
    path: '/',
    menuKey: 'index',
    redirect: '/article',
    component: BasicLayout,
    routes: [
      {
        path: '/article',
        menuKey: 'article',
        exact: true,
        component: lazy(
          () =>
            import(
              /* webpackPrefetch: true */ /* webpackChunkName: "article" */ '@b-blog/containers/article'
            ),
        ),
        icon: <AlipayOutlined />,
      },
      {
        path: '/reply',
        menuKey: 'reply',
        exact: true,
        component: lazy(
          () =>
            import(
              /* webpackPrefetch: true */ /* webpackChunkName: "reply" */ '@b-blog/containers/reply'
            ),
        ),
        icon: <AlipayOutlined />,
      },
      {
        path: '/message',
        menuKey: 'message',
        exact: true,
        component: lazy(
          () =>
            import(
              /* webpackPrefetch: true */ /* webpackChunkName: "message" */ '@b-blog/containers/message'
            ),
        ),
        // authPoints: ['blog.super_admin-is', 'blog.personal_admin-is'],
        // authOperator: 'or',
        icon: <ZhihuOutlined />,
      },
      {
        path: '/category',
        menuKey: 'category',
        exact: true,
        component: lazy(
          () =>
            import(
              /* webpackPrefetch: true */ /* webpackChunkName: "category" */ '@b-blog/containers/category'
            ),
        ),
        icon: <AlipayOutlined />,
      },
      {
        path: '/tag',
        menuKey: 'tag',
        exact: true,
        component: lazy(
          () =>
            import(
              /* webpackPrefetch: true */ /* webpackChunkName: "tag" */ '@b-blog/containers/tag'
            ),
        ),
        icon: <AlipayOutlined />,
      },
    ],
  },
]

export default routes
