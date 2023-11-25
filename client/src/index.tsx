import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { QueryClientProvider } from './providers/QueryClientProvider'

import { AppStateProvider } from './context/AppState.context'

ReactDOM.createRoot(document.getElementById('root') as Element).render(
  <React.StrictMode>
    <QueryClientProvider>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
