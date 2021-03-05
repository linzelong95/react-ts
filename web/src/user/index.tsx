import { renderApp } from '@common/components'
import routes from './configs/routes'
import './locales'

renderApp({
  appName: 'user',
  basename: '/user',
  routes,
})

if (module?.hot) {
  module.hot.accept(() => {
    renderApp({
      appName: 'user',
      basename: '/user',
      routes,
    })
  })
}
