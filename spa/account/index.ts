import { renderApp } from '@common/components'
import routes from './configs/routes'
import './locales'

renderApp({
  basename: '/account',
  routes,
})

if (module?.hot) {
  module.hot.accept(() => {
    renderApp({
      basename: '/account',
      routes,
    })
  })
}
