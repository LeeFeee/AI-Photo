/**
 * 异步操作 Hook
 * Async operation hook
 *
 * 简化异步操作的状态管理
 * Simplifies state management for async operations
 */

import { useState, useCallback } from 'react'
import type { AsyncState, LoadingState } from '@/types'

export function useAsync<T = unknown>() {
  const [state, setState] = useState<AsyncState<T>>({
    status: 'idle',
    data: undefined,
    error: undefined,
  })

  // 执行异步操作 / Execute async operation
  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    setState({ status: 'loading', data: undefined, error: undefined })

    try {
      const data = await asyncFunction()
      setState({ status: 'success', data, error: undefined })
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setState({ status: 'error', data: undefined, error: errorMessage })
      throw error
    }
  }, [])

  // 重置状态 / Reset state
  const reset = useCallback(() => {
    setState({ status: 'idle', data: undefined, error: undefined })
  }, [])

  return {
    ...state,
    execute,
    reset,
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    isIdle: state.status === 'idle',
  }
}
