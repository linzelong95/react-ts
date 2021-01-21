import React from 'react'
import ReactDOM from 'react-dom'
import store from '@src/store'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { ErrorBoundary } from '@common/components'
import { Provider } from 'react-redux'
import App from '@src/app'
import '@src/index.global.less'
import '@src/locales'

if (module && module.hot) {
  module.hot.accept()
}

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        {process.env.NODE_ENV === 'development' ? (
          <HashRouter>
            <App />
          </HashRouter>
        ) : (
          <BrowserRouter>
            <App />
          </BrowserRouter>
        )}
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.querySelector('#root'),
)
