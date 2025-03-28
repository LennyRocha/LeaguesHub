import React from "react";

export default function DuenoEquipos({ cambiarComponente }) {
  return (
    <div>
      DuenoEquipos
      <button onClick={() => cambiarComponente("C")}>
        Ir al otro componente
      </button>
    </div>
  );
}
