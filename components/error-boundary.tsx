'use client'

import { Component, ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { Button } from './ui/button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('错误边界捕获到错误:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-md animate-fade-in">
            <div className="rounded-full bg-red-100 p-6 mx-auto w-fit mb-4">
              <AlertCircle className="h-12 w-12 text-red-600" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              出错了
            </h1>
            <p className="text-gray-600 mb-6">
              抱歉，应用遇到了一个错误。请刷新页面重试。
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="text-left text-xs bg-gray-100 p-4 rounded-lg mb-4 overflow-auto">
                {this.state.error.message}
              </pre>
            )}
            <Button
              onClick={() => window.location.reload()}
              aria-label="重新加载页面"
            >
              刷新页面
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
