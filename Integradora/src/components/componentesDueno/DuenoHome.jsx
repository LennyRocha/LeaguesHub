import React from "react";

export default function DuenoHome({ cambiarComponente }) {
    //Depende de a donde quieras ir, solo cambia la letra, del A a la D como viene en el contexto 
  return (
    <div>
      DuenoHome
      <button onClick={() => cambiarComponente("B")}>
        Ir al otro componente
      </button>
    </div>
  );
}
