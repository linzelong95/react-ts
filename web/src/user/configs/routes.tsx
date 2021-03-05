import { lazy } from 'react'
import type { RouteConfig } from '@common/types'

const routes: RouteConfig[] = [
  {
    path: '/',
    menuKey: 'user',
    redirect: '/login',
    routes: [
      {
        path: '/login',
        menuKey: 'login',
        exact: true,
        component: lazy(() => import(/* webpackPrefetch: true */ '@user/containers/login')),
      },
      {
        path: '/register',
        menuKey: 'register',
        exact: true,
        component: lazy(() => import(/* webpackPrefetch: true */ '@user/containers/register')),
      },
    ],
  },
]

export default routes
