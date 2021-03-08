import { renderApp } from '@common/components'
import routes from './configs/routes'
import './locales'

renderApp({
  appName: 'my blog',
  basename: '/blog-admin',
  routes,
})

if (module?.hot) {
  module.hot.accept(() => {
    renderApp({
      appName: 'my blog',
      basename: '/blog-admin',
      routes,
    })
  })
}

// if (module?.hot) {
//   module.hot.accept('./configs/routes', () => {
//     import('./configs/routes')
//       .then((res) => {
//         console.log(7777, res)
//         renderApp({
//           appName: 'my blog',
//           basename: '/blog-admin',
//           routes: res.default,
//         })
//       })
//       .catch((error) => {
//         console.log(error.message)
//       })
//   })
// }
