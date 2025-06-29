import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import AppRouter from './AppRoute/index.tsx'
import { AuthProvider } from './AuthWrap/index.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   
  <AuthProvider>
      <AppRouter/>
  </AuthProvider>
 
  </StrictMode>,
)
