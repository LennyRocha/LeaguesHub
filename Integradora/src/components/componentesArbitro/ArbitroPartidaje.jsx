import React from "react";

//Este es para que el arbitro registre el partido
export default function ArbitroPartidaje({ cambiarComponente }) {
  return (
    <div>
      ArbitroPartidaje
      <button onClick={() => cambiarComponente("A")}>Volver</button>
    </div>
  );
}
