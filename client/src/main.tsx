import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react'
import { authClient } from './lib/auth.ts'
import AuthContextProvider from './context/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NeonAuthUIProvider authClient={authClient}>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </NeonAuthUIProvider>
  </StrictMode>,
)
