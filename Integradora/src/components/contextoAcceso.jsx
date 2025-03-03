import React from 'react'
import { useState } from 'react';
import Acces from './Acces';
import Password from './password';

export default function ContextoAcceso() {
  const [componenteActual, setComponenteActual] = useState("A");
  const renderizarComponente = () => {
    switch (componenteActual) {
      case "A":
        return <Acces cambiarComponente={setComponenteActual} />;
      case "B":
        return <Password cambiarComponente={setComponenteActual} />;
      default:
        return <Acces cambiarComponente={setComponenteActual} />;
    }
  };
  return (
    <>
      {renderizarComponente()}
    </>
  )
}