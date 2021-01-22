import React from 'react'
import { RouteConfig } from '@common/types'
import { asyncComponent } from '@utils/routes'
import { AlipayOutlined, ZhihuOutlined } from '@ant-design/icons'
// import { hot } from 'react-hot-loader/root'

const routes: RouteConfig[] = [
  {
    path: '/c',
    exact: true,
    redirect: '/test-a',
    authPoints: ['blog.super_admin-is'],
    icon: <AlipayOutlined />,
  },
  {
    path: '/d',
    exact: true,
    authPoints: ['blog.personal_admin-is'],
    component: asyncComponent(() => import(/* webpackPrefetch: true */ '@containers/test')),
    icon: <ZhihuOutlined />,
  },
  {
    path: '/test-c',
    exact: true,
    component: asyncComponent(() => import(/* webpackPrefetch: true */ '@containers/test-a')),
    authPoints: ['blog.super_admin-is', 'blog.personal_admin-is'],
    authOperator: 'or',
    icon: <ZhihuOutlined />,
  },
  {
    path: '/root',
    component: asyncComponent(() => import(/* webpackPrefetch: true */ '@containers/test')),
    // exact: true,
    redirect: '/root/test-a',
    icon: <ZhihuOutlined />,
    routes: [
      {
        path: '/root/test-a',
        // exact: true,
        component: asyncComponent(() => import(/* webpackPrefetch: true */ '@containers/test-a')),
        redirect: '/root/test-a/test-b',
        icon: <ZhihuOutlined />,
        routes: [
          {
            path: '/root/test-a/test-b',
            exact: true,
            component: asyncComponent(() => import(/* webpackPrefetch: true */ '@containers/test-b')),
            icon: <ZhihuOutlined />,
          },
          {
            path: '/root/test-a/test-c',
            authPoints: ['blog.super_admin-is', 'blog.personal_admin-is'],
            authOperator: 'and',
            exact: true,
            component: asyncComponent(() => import(/* webpackPrefetch: true */ '@containers/test-c')),
            icon: <ZhihuOutlined />,
          },
        ],
      },
    ],
  },
  {
    path: '/',
    redirect: '/root/test-a',
  },
]

export default routes
