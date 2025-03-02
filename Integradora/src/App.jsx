import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import Login from './components/login'
import Signup from './components/signup'
import Perfil from './components/perfil'
import Password from './components/password'
import Acces from './components/Acces'

import './App.css'

function App() {
  const [componenteActual, setComponenteActual] = useState("A");
  const renderizarComponente = () => {
    switch (componenteActual) {
      case "A":
        return <Login cambiarComponente={setComponenteActual} />;
      case "B":
        return <Signup cambiarComponente={setComponenteActual} />;
      case "C":
        return <Password cambiarComponente={setComponenteActual} />;
      case "D":
        return <Perfil cambiarComponente={setComponenteActual} />;
      default:
        return <Login cambiarComponente={setComponenteActual} />;
    }
  };

  return (
    <>
      {renderizarComponente()}
    </>
  )
}

export default App
