import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ContextoAcceso from './components/contextoAcceso'
import { AuthProvider } from './context/AuthContext'
import './index.css'

createRoot(document.getElementById('authRoot')).render(
    <AuthProvider>
        <ContextoAcceso />
    </AuthProvider>
)