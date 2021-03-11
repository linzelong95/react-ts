import React from 'react'
import { Result, Button } from 'antd'
import { captureException } from '@sentry/browser'
import type { CSSProperties } from 'react'

const style: CSSProperties = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

interface ErrorBoundaryState {
  hasError: boolean
  errorMessage: string
  componentStack: string
}

class ErrorBoundary extends React.Component<unknown, ErrorBoundaryState> {
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
    captureException(error)
  }

  render(): React.ReactNode {
    const { hasError } = this.state
    const { children } = this.props
    if (!hasError) return children
    return (
      <div style={style}>
        <Result
          status="500"
          title="500"
          subTitle="Sorry, something went wrong."
          extra={
            <Button type="primary" href="/">
              Back Home
            </Button>
          }
        />
      </div>
    )
  }
}

export default ErrorBoundary
