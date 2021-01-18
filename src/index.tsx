import React from 'react'
import ReactDOM from 'react-dom'
import store from '@src/store'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import App from '@src/app'
import { ErrorBoundary } from '@common/components'
import '@src/index.global.less'
import '@src/locales'

if (module && module.hot) {
  module.hot.accept()
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        {process.env.NODE_ENV === 'development' ? (
          <HashRouter>
            <App />
          </HashRouter>
        ) : (
          <BrowserRouter>
            <App />
          </BrowserRouter>
        )}
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>,
  document.querySelector('#root'),
)
