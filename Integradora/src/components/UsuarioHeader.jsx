import React, { useEffect, useState } from "react";
import "bootstrap";
import miImagen from "../img/logo1.png";
import "../css/UsuarioHeader.css";
import UsuarioMain from "./UsuarioCero/UsuarioMain";
import UsuarioCarrusel from "./UsuarioCero/UsuarioCarrusel";
import UsuarioDestac from "./UsuarioCero/UsuarioDestac";
import UsuarioTabla1 from "./UsuarioCero/UsuarioTabla1";
import UsuarioTabla2 from "./UsuarioCero/UsuarioTabla2";
import UsuarioLista from "./UsuarioCero/UsuarioLista";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min";

export default function Usuario0({ cambiarComponente }) {
  const [id1, setId1] = useState("");
  const [id2, setId2] = useState("");
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setId1("#clasif-sm");
        setId2("#goleo-sm");
      } else {
        setId1("#clasif");
        setId2("#goleo");
      }
    };

    handleResize(); // Ejecutar al inicio
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <a
          className="d-flex text-center align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none"
          id="logoHead"
        >
          <img src={miImagen} width={40} height={50} alt="Logo" />
          <span className="fs-4 text-white">Leagues Hub</span>
        </a>
        <ul
          className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0"
          id="headerMain"
        >
          <li>
            <a href="#inicio" className="nav-link px-2 texto-blanco">
              Inicio
            </a>
          </li>
          {/* <li>
            <a href="#torneos" className="nav-link px-2 texto-blanco">
              Torneos
            </a>
          </li> */}
          <li>
            <a href={id1} className="nav-link px-2 texto-blanco">
              Clasificación
            </a>
          </li>
          {/* <li>
            <a href="#destac" className="nav-link px-2 texto-blanco">
              Destacados
            </a>
          </li> */}
          <li>
            <a href={id2} className="nav-link px-2 texto-blanco">
              Goleadores
            </a>
          </li>
        </ul>
        <div className="col-md-3 text-end">
          <a type="button" className="btn red-b" href="/acceso">
            Acceder
          </a>
        </div>
      </header>

      <br />
    </div>
  );
}
