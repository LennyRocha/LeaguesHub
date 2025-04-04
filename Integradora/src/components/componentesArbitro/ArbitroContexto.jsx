import React, { useEffect } from "react";
import { useState } from "react";
import ArbitroLista from "./ArbitroLista";
import ArbitroPartidaje from "./ArbitroPartidaje";

export default function ArbitroContexto() {
  const [componenteActual, setComponenteActual] = useState("A");
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);

  useEffect(() => {
    document.title = 'Arbitros'
  },[])

  const renderizarComponente = () => {
    switch (componenteActual) {
      case "A":
        return (
          <ArbitroLista
            cambiarComponente={setComponenteActual}
            setPartidoSeleccionado={setPartidoSeleccionado}
          />
        );
      case "B":
        return (
          <ArbitroPartidaje
            cambiarComponente={setComponenteActual}
            partidoSeleccionado={partidoSeleccionado}
          />
        );
      default:
        return <div>Error: componente desconocido</div>;
    }
  };

  return <>{renderizarComponente()}</>; // 🔴 ESTO FALTABA
}