import { renderApp } from '@common/components'
import routes from './configs/routes'
import './locales'

renderApp({
  appName: 'account',
  basename: '/account',
  routes,
})

if (module?.hot) {
  module.hot.accept(() => {
    renderApp({
      appName: 'account',
      basename: '/account',
      routes,
    })
  })
}
