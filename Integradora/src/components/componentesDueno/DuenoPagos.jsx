import React from "react";

export default function DuenoPagos({ cambiarComponente }) {
  return (
    <div>
      DuenoPagos
      <button onClick={() => cambiarComponente("A")}>
        Ir al otro componente
      </button>
    </div>
  );
}
