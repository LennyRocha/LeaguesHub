import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ContextoAcceso from './components/contextoAcceso'
import './index.css'

createRoot(document.getElementById('authRoot')).render(
    <StrictMode>
        <ContextoAcceso />
    </StrictMode>
)