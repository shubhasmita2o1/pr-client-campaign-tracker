import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught an error]:', error, errorInfo)
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Something went wrong
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                An unexpected application error occurred. The application state has been preserved safely.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 text-left overflow-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <div className="flex gap-2.5 pt-2">
              <Button
                variant="outline"
                className="flex-1 text-xs gap-1.5 h-9"
                onClick={() => window.location.reload()}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reload Page</span>
              </Button>
              <Button
                className="flex-1 text-xs gap-1.5 h-9 bg-sky-500 hover:bg-sky-600 text-white"
                onClick={this.handleReset}
              >
                <Home className="h-3.5 w-3.5" />
                <span>Return to Dashboard</span>
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
