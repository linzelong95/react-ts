import React from 'react'
import APP, { AppContext } from 'next/app'
import Router from 'next/router'
import { Provider } from 'react-redux'
import getCombinedStore from '@ssr/common/store'
import { PageLoad, PageLayout } from '@ssr/common/components'
import type { IAppContext } from '@ssr/common/types'
import '@ssr/common/styles/globals.css'
import 'antd/dist/antd.css'

const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

interface MyAppProps {
  pageProps: Record<string, any>
  initialReduxState: Record<string, any>
}

class MyApp extends APP<MyAppProps, Record<string, never>, { loading: boolean }> {
  store: any

  constructor(props: MyAppProps) {
    super(props as any)
    const { initialReduxState } = props
    this.store = getCombinedStore(initialReduxState)
  }

  state = {
    loading: false,
  }

  componentDidMount(): void {
    Router.events.on('routeChangeStart', this.toggleLoading)
    Router.events.on('routeChangeComplete', this.toggleLoading)
    Router.events.on('routeChangeError', this.toggleLoading)
  }

  componentWillUnmount(): void {
    Router.events.off('routeChangeStart', this.toggleLoading)
    Router.events.off('routeChangeComplete', this.toggleLoading)
    Router.events.off('routeChangeError', this.toggleLoading)
  }

  static async getInitialProps({ Component, ctx }: AppContext): Promise<MyAppProps> {
    let store
    if (typeof window === 'undefined') {
      const { req } = ctx as IAppContext['ctx']
      const user = req?.userInfo || {}
      store = getCombinedStore({ user })
    } else {
      if (!window[__NEXT_REDUX_STORE__]) window[__NEXT_REDUX_STORE__] = getCombinedStore({})
      store = window[__NEXT_REDUX_STORE__]
    }
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {}
    return { pageProps, initialReduxState: store.getState() }
  }

  toggleLoading = (): void => {
    this.setState((prevState) => ({
      loading: !prevState.loading,
    }))
  }

  render(): JSX.Element {
    const { loading } = this.state
    const { Component, pageProps } = this.props
    return (
      <Provider store={this.store}>
        {loading && <PageLoad />}
        <PageLayout>
          <Component {...pageProps} />
        </PageLayout>
      </Provider>
    )
  }
}

export default MyApp
