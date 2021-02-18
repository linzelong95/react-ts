import { renderApp } from '@common/components'
import routes from './configs/routes'

renderApp({
  appName: 'my blog',
  basename: '/blog-admin',
  routes,
})
