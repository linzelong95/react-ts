import React from 'react'
import creatStore from '@client/common/store'
import type { IAppContext } from '@client/common/types'

const isServer = typeof window === 'undefined'

const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

function getOrCreatStore(initialState = {}) {
  if (isServer) return creatStore(initialState)
  if (!window[__NEXT_REDUX_STORE__]) window[__NEXT_REDUX_STORE__] = creatStore(initialState)
  return window[__NEXT_REDUX_STORE__]
}

interface WithReduxAppProps extends IAppContext {
  initialReduxState: Record<string, any>
  pageProps: Record<string, any>
}

export default function withRedux(Comp) {
  class WithReduxApp extends React.Component<WithReduxAppProps> {
    reduxStore: any

    constructor(props) {
      super(props)
      const { initialReduxState } = props
      this.reduxStore = getOrCreatStore(initialReduxState)
    }

    static async getInitialProps(appContext: IAppContext) {
      let reduxStore
      if (isServer) {
        const { req } = appContext.ctx
        const user = req?.userInfo
        reduxStore = getOrCreatStore(user ? { user } : {})
      } else {
        reduxStore = getOrCreatStore()
      }
      // appContext.reduxStore = reduxStore 给全局appContext注入属性，其他组件可以直接读取
      const appProps: { pageProps: Record<string, any> } = Comp.getInitialProps ? await Comp.getInitialProps(appContext) : {}
      return {
        ...appProps,
        initialReduxState: reduxStore.getState(),
      }
    }

    render() {
      return <Comp {...this.props} reduxStore={this.reduxStore} />
    }
  }
  return WithReduxApp
}
