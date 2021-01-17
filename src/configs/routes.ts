import { hot } from 'react-hot-loader/root'
import { RouteConfig } from '@common/types'
import Test from '@containers/test'
import TestA from '@containers/test-a'
import TestB from '@containers/test-b'
import TestC from '@containers/test-c'

const routes: RouteConfig[] = [
  {
    path: '/c',
    exact: true,
    redirect: '/test-a',
  },
  {
    path: '/d',
    exact: true,
  },
  {
    path: '/test-c',
    exact: true,
    component: hot(TestC),
  },
  {
    path: '/',
    component: hot(Test),
    // exact: true,
    redirect: '/test-a',
    routes: [
      {
        path: '/test-a',
        // exact: true,
        component: hot(TestA),
        redirect: '/test-a/test-b',
        routes: [
          {
            path: '/test-a/test-b',
            exact: true,
            component: hot(TestB),
          },
          {
            path: '/test-a/test-c',
            exact: true,
            component: hot(TestC),
          },
        ],
      },
    ],
  },
]

export default routes
