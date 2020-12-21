import React from 'react'
import ReactDOM from 'react-dom'
import store from '@src/store'
import { Provider } from 'react-redux'
import App from '@src/app'
import '@src/index.global.less'

if (module && module.hot) {
  module.hot.accept()
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.querySelector('#root'),
)
