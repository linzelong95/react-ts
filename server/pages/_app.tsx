import React from 'react'
import APP, { AppContext } from 'next/app'
import Router from 'next/router'
import { Provider } from 'react-redux'
import { withRedux, PageLoad, PageLayout } from '@client/common/components'
import '@client/common/styles/globals.css'
import 'antd/dist/antd.css'

interface MyAppProps {
  pageProps: Record<string, any>
  reduxStore: any
}

class MyApp extends APP<MyAppProps, Record<string, never>, { loading: boolean }> {
  state = {
    loading: false,
  }

  componentDidMount() {
    Router.events.on('routeChangeStart', this.toggleLoading)
    Router.events.on('routeChangeComplete', this.toggleLoading)
    Router.events.on('routeChangeError', this.toggleLoading)
  }

  componentWillUnmount() {
    Router.events.off('routeChangeStart', this.toggleLoading)
    Router.events.off('routeChangeComplete', this.toggleLoading)
    Router.events.off('routeChangeError', this.toggleLoading)
  }

  static async getInitialProps({ Component, ctx }: AppContext) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {}
    return { pageProps }
  }

  toggleLoading = () => {
    this.setState((prevState) => ({
      loading: !prevState.loading,
    }))
  }

  render() {
    const { loading } = this.state
    const { Component, pageProps, reduxStore } = this.props
    return (
      <Provider store={reduxStore}>
        {loading && <PageLoad />}
        <PageLayout>
          <Component {...pageProps} reduxStore={reduxStore} />
        </PageLayout>
      </Provider>
    )
  }
}

export default withRedux(MyApp)
