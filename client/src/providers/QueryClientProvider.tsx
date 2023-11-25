import {
  QueryClient,
  QueryClientProvider as QueryClientProviderBase
} from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      gcTime: 1000 * 60 * 60 * 24 // 24 hours
    }
  }
})

interface QueryClientProviderProps {
  children: React.ReactNode
}

export function QueryClientProvider ({ children }: QueryClientProviderProps) {
  return (
    <QueryClientProviderBase client={queryClient}>
      {children}
    </QueryClientProviderBase>
  )
}
