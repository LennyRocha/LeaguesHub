import React, { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
//import UsuarioMap  from "./UsuarioMap";
import UsuarioCarrusel from "./UsuarioCarrusel";
import UsuarioRow from "./UsuarioRow";
import UsuarioDestac from "./UsuarioDestac";
import UsuarioTabla1 from "./UsuarioTabla1";
import UsuarioTabla2 from "./UsuarioTabla2";
import UsuarioLista from "./UsuarioLista";
import axios from "axios";
import "../../css/usuario.css";
import "bootstrap";

export default function UsuarioMain({ cambiarComponente }) {
  const transformarUrl = (url) => {
    const match = url.match(/id=([^&]+)/); // Extrae el ID de la imagen
    return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
  };

  const api = import.meta.env.VITE_API_URL;

  return (
    <div id="main">
      <UsuarioRow getUrl={transformarUrl} api={api} />
      <UsuarioLista cambiarComponente={cambiarComponente} getUrl={transformarUrl} api={api} />
      <UsuarioCarrusel />
      <UsuarioTabla1 />
      <UsuarioDestac />
      <UsuarioTabla2 />
    </div>
  );
}
