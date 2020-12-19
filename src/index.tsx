import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './app'

if (module && module.hot) {
  module.hot.accept()
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.querySelector('#root'),
)
