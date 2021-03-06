import { renderApp } from '@common/components'
import routes from './configs/routes'
import './locales'
import '@common/styles/globals.css'

renderApp({
  basename: '/b-blog',
  routes,
})

if (module?.hot) {
  module.hot.accept(() => {
    renderApp({
      basename: '/b-blog',
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
//           basename: '/b-blog',
//           routes: res.default,
//         })
//       })
//       .catch((error) => {
//         console.log(error.message)
//       })
//   })
// }
