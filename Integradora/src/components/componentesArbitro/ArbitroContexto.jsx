import React, { useEffect, useContext } from "react";
import { useState } from "react";
import ArbitroLista from "./ArbitroLista";
import ArbitroPartidaje from "./ArbitroPartidaje";
import miImagen from "../../img/logo4.png";
import "../../css/sb-admin-2.css";
import "bootstrap";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";

export default function ArbitroContexto() {
  const [componenteActual, setComponenteActual] = useState("A");
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);
  const { api_url, getUrl, logout, getout, getToken, getUserId } =
    useContext(AuthContext);

  const [arbitro, setArbitro] = useState({});

  useEffect(() => {
    document.title = "Arbitros";
    const getData = async () => {
      const tok = await getToken();
      const id = await getUserId();
      console.log(tok, id, api_url);
      await axios
        .get(`${api_url}/api/arbitros/poruser/${id}`, {
          headers: {
            Authorization: `Bearer ${tok}`,
          },
        })
        .then((res) => {
          setArbitro(res.data);
          console.log(res.data);
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            text: "No se pudierón recuperar tus datos",
            timer: 2500,
            showConfirmButton: false,
          });
          console.error(err, err.toJSON());
        });
    };
    getData();
  }, []);

  const renderizarComponente = () => {
    switch (componenteActual) {
      case "A":
        return (
          <ArbitroLista
            cambiarComponente={setComponenteActual}
            setPartidoSeleccionado={setPartidoSeleccionado}
          />
        );
      case "B":
        return (
          <ArbitroPartidaje
            cambiarComponente={setComponenteActual}
            partidoSeleccionado={partidoSeleccionado}
          />
        );
      default:
        return <div>Error: componente desconocido</div>;
    }
  };

  return (
    <div id="arbitros">
      <header class="py-2 px-3">
        <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start gap-1">
          <a class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
            <img src={miImagen} width={100} height={50} alt="Logo" />
          </a>

          <span className="fs-4 text-white nav col-12 col-lg-8 me-lg-auto mb-2 align-items-center justify-content-center mb-md-0">
            Sistema de registro de partidos
          </span>

          <div class="text-end">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item dropdown no-arrow p-0">
                <a
                  className="nav-link arbi-link dropdown-toggle"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span className="mr-3 d-lg-inline text-white small">
                    {arbitro.nombreCompleto || "Usuario Árbitro"}
                  </span>
                  <img
                    className="img-profile rounded-circle"
                    src={
                      getUrl(arbitro.imagenUrl) ||
                      "https://www.meme-arsenal.com/memes/a513f913ef43476bd2b494da4e599cbc.jpg"
                    }
                    alt="Foto de perfil"
                    width={32}
                    height={32}
                  />
                </a>

                <div
                  className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                  aria-labelledby="userDropdown"
                >
                  <a className="dropdown-item d-item-red" href="/perfil">
                    <i className="fas fa-user en-fa fa-sm fa-fw mr-2 text-gray-400"></i>
                    Mi Perfil
                  </a>
                  <div className="dropdown-divider"></div>
                  <a
                    className="dropdown-item d-item-red"
                    data-toggle="modal"
                    data-target="#logoutModal"
                    onClick={() => logout()}
                  >
                    <i className="fas fa-sign-out-alt en-fa fa-sm fa-fw mr-2 text-gray-400"></i>
                    Cerrar sesión
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </header>
      {renderizarComponente()}
    </div>
  ); // 🔴 ESTO FALTABA
}
