import React from "react";
import { useState } from "react";
import ArbitroLista from "./ArbitroLista";
import ArbitroPartidaje from "./ArbitroPartidaje";

//Aqui no muevas nada, es una especie de contexto para las 2 pantallas de arbirtro
//Aqui si quieres puedes declarar las variables que van a compartir y se las pasas como parametros
export default function ArbitroContexto() {
  //Por ejemplo, este es para cambiar el componente visible, y lo hereda a los otros 2
  const [componenteActual, setComponenteActual] = useState("A");
  const renderizarComponente = () => {
    switch (componenteActual) {
      case "A":
        return <ArbitroLista cambiarComponente={setComponenteActual} />;
      case "B":
        return <ArbitroPartidaje cambiarComponente={setComponenteActual} />;
      default:
        return <ArbitroLista cambiarComponente={setComponenteActual} />;
    }
  };
  return <>{renderizarComponente()}</>;
}
