import React from 'react'
import { Icon } from '@common/components'
import './app.less'
import testImgUrl from '@public/images/haha.jpeg'
import testSvgUrl from '@public/images/mail.svg'

function App(): JSX.Element {
  const a = [1, 3, 5]
  const b = [...a]
  return (
    <div className="app">
      <Icon className="map-icon" name="model" width="40px" height="40px" color="#333" />
      <header className="app-header">
        <p>
          Ed8886 <code>src/App.js</code> and save to reload.{b.join(',')}
        </p>
        <a className="app-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
        <img src={testImgUrl} />
        <div style={{ background: 'black' }}>
          <span style={{ background: `url(${testSvgUrl})`, backgroundSize: '50px 50px' }} />
        </div>
      </header>
    </div>
  )
}

export default App
