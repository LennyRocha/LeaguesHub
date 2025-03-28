import React from "react";

export default function DuenoJugadores({ cambiarComponente }) {
  return (
    <div>
      DuenoJugadores
      <button onClick={() => cambiarComponente("D")}>
        Ir al otro componente
      </button>
    </div>
  );
}
