import React from 'react'
import ReactDOM from 'react-dom'
import store from '@src/store'
import { BrowserRouter } from 'react-router-dom'
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
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.querySelector('#root'),
)
