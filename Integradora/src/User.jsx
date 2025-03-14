import React from "react";
import { useState } from "react";
;
import Signup from "./components/signup";
import Perfil from "./components/perfil";
import Password from "./components/password";
import Usuario0 from "./components/UsuarioHeader";
import UsuarioFooter from "./components/UsuarioFooter";
import UsuarioMain from "./components/UsuarioCero/UsuarioMain";
import UsuarioTorneos from "./components/UsuarioCero/UsuarioTorneos";
import "bootstrap";
import "./App.css";

export default function User() {
  const [componenteActual, setComponenteActual] = useState("A");
  const renderizarComponente = () => {
    console.log(componenteActual);
    switch (componenteActual) {
      case "A":
        return <UsuarioMain cambiarComponente={setComponenteActual} />;
      case "B":
        return <Signup cambiarComponente={setComponenteActual} />;
      case "C":
        return <Password cambiarComponente={setComponenteActual} />;
      case "D":
        return <Perfil cambiarComponente={setComponenteActual} />;
      case "E":
        return <UsuarioTorneos cambiarComponente={setComponenteActual} />;
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
