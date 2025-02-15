import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import AdminDashboard from './components/headerAdmin'

import './index.css'

createRoot(document.getElementById('admin')).render(
  <AdminDashboard />
)