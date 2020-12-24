/**
 * 全局渲染错误 catch
 */
import React from 'react'
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
    return <div>错误界面</div>
  }
}
