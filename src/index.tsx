import React from 'react'
import ReactDOM from 'react-dom'
import '@src/style/index.global.less'
import App from '@src/app'

if (module && module.hot) {
  module.hot.accept()
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.querySelector('#root'),
)
