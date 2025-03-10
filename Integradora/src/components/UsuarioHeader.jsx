import React from "react";
import "bootstrap";
import miImagen from "../img/logo1.png";
import "../css/UsuarioHeader.css";

export default function Usuario0({ cambiarComponente }) {
  return (
    <div className="sticky-header">
      <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom p-5 w-100">
        <div className='headerTitle'>
        <a
          className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none"
        >
          <img src={miImagen} width={40} height={50} alt="Logo" />
        </a>
        Leagues Hub
        </div>

        <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0" id="headerMain">
          <li>
            <a href="#inicio" className="nav-link px-2 texto-blanco">
              Inicio
            </a>
          </li>
          <li>
            <a href="#torneos" className="nav-link px-2 texto-blanco">
              Torneos
            </a>
          </li>
          <li>
            <a href="#clasif" className="nav-link px-2 texto-blanco">
              Clasificación
            </a>
          </li>
          <li>
            <a href="#destac" className="nav-link px-2 texto-blanco">
              Destacados
            </a>
          </li>
          <li>
            <a href="#goleo" className="nav-link px-2 texto-blanco">
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
    </div>
  );
}
