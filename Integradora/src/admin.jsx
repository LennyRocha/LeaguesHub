import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import AdminDashboard from './components/headerAdmin'
import { AuthProvider } from './context/AuthContext'

import './index.css'

createRoot(document.getElementById('admin')).render(
  <AuthProvider>
      <AdminDashboard />
  </AuthProvider>
)