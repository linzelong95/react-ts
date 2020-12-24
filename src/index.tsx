import React from 'react'
import ReactDOM from 'react-dom'
import store from '@src/store'
import { Provider } from 'react-redux'
import App from '@src/app'
import { ErrorBoundary } from '@common/components'
import '@src/index.global.less'

if (module && module.hot) {
  module.hot.accept()
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>,
  document.querySelector('#root'),
)
