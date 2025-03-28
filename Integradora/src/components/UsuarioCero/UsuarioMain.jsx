import React, { useEffect, useState } from "react";
import UsuarioMap from "./UsuarioMap";
import UsuarioCarrusel from "./UsuarioCarrusel";
import UsuarioRow from "./UsuarioRow";
import UsuarioDestac from "./UsuarioDestac";
import UsuarioTabla1 from "./UsuarioTabla1";
import UsuarioTabla2 from "./UsuarioTabla2";
import UsuarioLista from "./UsuarioLista";
import axios from "axios";
import "../../css/usuario.css";
import "bootstrap";

export default function UsuarioMain() {
  const [vista, setVista] = useState("LISTA");
  const [torneoIdSeleccionado, setTorneoIdSeleccionado] = useState(null);

  const transformarUrl = (url) => {
    const match = url.match(/id=([^&]+)/);
    return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
  };

  const api = import.meta.env.VITE_API_URL;

  const cambiarComponente = (vistaNueva, torneoId = null) => {
    setVista(vistaNueva);
    if (torneoId) setTorneoIdSeleccionado(torneoId);
  };

  return (
    <div id="main">
      <UsuarioRow getUrl={transformarUrl} api={api} />

      {vista === "LISTA" && (
        <UsuarioLista
          cambiarComponente={cambiarComponente}
          getUrl={transformarUrl}
          api={api}
        />
      )}

      {vista === "MAP" && torneoIdSeleccionado && (
        <UsuarioMap
          torneoId={torneoIdSeleccionado}
          getUrl={transformarUrl}
          api={api}
          volver={() => setVista("LISTA")}
        />
      )}

      {/* <UsuarioCarrusel /> */}
      <UsuarioTabla1 api={api} />
      {/* <UsuarioDestac /> */}
      <UsuarioTabla2 />
    </div>
  );
}