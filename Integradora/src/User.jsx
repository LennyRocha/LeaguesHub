import React from "react";
import { useState } from "react";
import Usuario0 from "./components/UsuarioHeader";
import UsuarioFooter from "./components/UsuarioFooter";
import UsuarioMain from "./components/UsuarioCero/UsuarioMain";
import UsuarioTorneos from "./components/UsuarioCero/UsuarioTorneos";
import "bootstrap";
import "./App.css";

export default function User() {
  const [componenteActual, setComponenteActual] = useState("A");
  const renderizarComponente = () => {
    switch (componenteActual) {
      case "A":
        return <UsuarioMain cambiarComponente={setComponenteActual} />;
      default:
        return <UsuarioMain cambiarComponente={setComponenteActual} />;
    }
  };

  return (
    <>
      <Usuario0 id="header" />
      <div id="rootApp">{renderizarComponente()}</div>
      <UsuarioFooter />
    </>
  );
}
