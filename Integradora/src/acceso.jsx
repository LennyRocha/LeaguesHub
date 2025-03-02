import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Acces from './components/Acces'
import './index.css'

createRoot(document.getElementById('authRoot')).render(
    <StrictMode>
        <Acces />
    </StrictMode>
)