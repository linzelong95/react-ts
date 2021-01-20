import React from 'react'
import { Result, Button } from 'antd'
import styles from './index.less'
// import { captureException } from '@sentry/browser'

interface ErrorBoundaryState {
  hasError: boolean
  errorMessage: string
  componentStack: string
}

export class ErrorBoundary extends React.Component<unknown, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
    componentStack: '',
  }

  componentDidCatch(error: Error, info: { componentStack: string }): void {
    this.setState({
      hasError: true,
      componentStack: info.componentStack,
      errorMessage: error.message,
    })
    // captureException(error) // 错误上报，比如使用sentry
  }

  render(): React.ReactNode {
    const { hasError } = this.state
    const { children } = this.props
    if (!hasError) return children
    return (
      <div className={styles['error-boundary']}>
        <Result status="500" title="500" subTitle="Sorry, something went wrong." extra={<Button type="primary">Back Home</Button>} />
      </div>
    )
  }
}
