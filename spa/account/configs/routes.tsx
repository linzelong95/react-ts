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
        component: lazy(() => import(/* webpackPrefetch: true */ /* webpackChunkName: "login" */ '@spa/account/containers/login')),
      },
      {
        path: '/register',
        menuKey: 'register',
        exact: true,
        component: lazy(() => import(/* webpackPrefetch: true */ /* webpackChunkName: "register" */ '@spa/account/containers/register')),
      },
      {
        path: '/profile/:id',
        menuKey: 'profile',
        exact: true,
        component: lazy(() => import(/* webpackPrefetch: true */ /* webpackChunkName: "profile" */ '@spa/account/containers/profile')),
      },
    ],
  },
]

export default routes
