import React from 'react'
import getStore from '@ssr/common/store'
import type { IAppContext } from '@ssr/common/types'

const isServer = typeof window === 'undefined'

interface WithReduxAppProps extends IAppContext {
  initialReduxState: Record<string, any>
  pageProps: Record<string, any>
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function withRedux(Comp: any): React.Component {
  class WithReduxApp extends React.Component<WithReduxAppProps> {
    store: any

    constructor(props) {
      super(props)
      const { initialReduxState } = props
      this.store = getStore(initialReduxState)
    }

    static async getInitialProps(appContext: IAppContext) {
      let store
      if (isServer) {
        const { req } = appContext.ctx
        const user = req?.userInfo || {}
        store = getStore({ user })
      } else {
        store = getStore()
      }
      // appContext.store = store 给全局appContext注入属性，其他组件可以直接读取
      const appProps: { pageProps?: Record<string, any> } = Comp.getInitialProps ? await Comp.getInitialProps(appContext as any) : {}
      return {
        ...appProps,
        initialReduxState: store.getState(),
      }
    }

    render() {
      return <Comp {...this.props} store={this.store} />
    }
  }
  return (WithReduxApp as unknown) as React.Component
}
