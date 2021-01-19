import { RouteConfig } from '@common/types'
// import { hot } from 'react-hot-loader/root'
import Test from '@containers/test'
import TestA from '@containers/test-a'
import TestB from '@containers/test-b'
import TestC from '@containers/test-c'

const routes: RouteConfig[] = [
  {
    path: '/c',
    exact: true,
    redirect: '/test-a',
    authPoints: ['blog.super_admin-is'],
  },
  {
    path: '/d',
    exact: true,
    authPoints: ['blog.personal_admin-is'],
  },
  {
    path: '/test-c',
    exact: true,
    component: TestC,
    authPoints: ['blog.super_admin-is', 'blog.personal_admin-is'],
    authOperator: 'and',
  },
  {
    path: '/root',
    component: Test,
    // exact: true,
    redirect: '/root/test-a',
    routes: [
      {
        path: '/root/test-a',
        // exact: true,
        component: TestA,
        redirect: '/root/test-a/test-b',
        routes: [
          {
            path: '/root/test-a/test-b',
            exact: true,
            component: TestB,
          },
          {
            path: '/root/test-a/test-c',
            authPoints: ['blog.super_admin-is', 'blog.personal_admin-is'],
            authOperator: 'and',
            exact: true,
            component: TestC,
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
