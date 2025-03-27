import React from "react";

//Este es para la lista principal de partidos
//Obtienes aqui cambiarComponente del contexto
export default function ArbitroLista({ cambiarComponente }) {
  return (
    <div>
      ArbitroLista
      <button onClick={() => cambiarComponente("B")}>Ir al otro componente</button>
    </div>
  );
}
