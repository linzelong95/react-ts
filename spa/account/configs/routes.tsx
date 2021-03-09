import { lazy } from 'react'
import type { RouteConfig } from '@common/types'

const routes: RouteConfig[] = [
  {
    path: '/',
    menuKey: 'account',
    redirect: '/login',
    routes: [
      {
        path: '/login',
        menuKey: 'login',
        exact: true,
        component: lazy(() => import(/* webpackPrefetch: true */ '@spa/account/containers/login')),
      },
      {
        path: '/register',
        menuKey: 'register',
        exact: true,
        component: lazy(() => import(/* webpackPrefetch: true */ '@spa/account/containers/register')),
      },
    ],
  },
]

export default routes
