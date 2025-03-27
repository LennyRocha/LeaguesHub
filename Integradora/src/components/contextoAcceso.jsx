import React from 'react'
import { useState } from 'react';
import Access from './Access';
import Password from './password';

export default function ContextoAcceso() {
  const [componenteActual, setComponenteActual] = useState("A");
  const renderizarComponente = () => {
    switch (componenteActual) {
      case "A":
        return <Access cambiarComponente={setComponenteActual} />;
      case "B":
        return <Password cambiarComponente={setComponenteActual} />;
      default:
        return <Access cambiarComponente={setComponenteActual} />;
    }
  };
  return (
    <>
      {renderizarComponente()}
    </>
  )
}