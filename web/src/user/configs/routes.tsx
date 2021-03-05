import { lazy } from 'react'
import type { RouteConfig } from '@common/types'

const routes: RouteConfig[] = [
  {
    path: '/',
    menuKey: 'user',
    redirect: '/sign/login',
    routes: [
      {
        path: '/sign/:type',
        menuKey: 'sign',
        exact: true,
        component: lazy(() => import(/* webpackPrefetch: true */ '@user/containers/login')),
      },
    ],
  },
]

export default routes
