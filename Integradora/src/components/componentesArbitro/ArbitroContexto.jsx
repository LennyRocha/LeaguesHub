import React, { useEffect, useContext, useRef } from "react";
import { useState } from "react";
import ArbitroLista from "./ArbitroLista";
import ArbitroPartidaje from "./ArbitroPartidaje";
import miImagen from "../../img/logo4.png";
import Logo1 from "../../img/logo1.png";
import "../../css/sb-admin-2.css";
import "bootstrap";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import userPlace from "../../assets/images/user-placeholder.png";

import LoadingScreen from "../LoadingScreen";
import NoAuthPage from "../componentesExternos/NoAuthPage";
import TokenPage from "../componentesExternos/TokenPage";

export default function ArbitroContexto() {
  const [componenteActual, setComponenteActual] = useState("A");
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);

  const [arbitro, setArbitro] = useState({});
  const [foto, setFoto] = useState("");
  const { getToken, decodeToken, getUserEmail, getUserRole, getUserId } =
    useContext(AuthContext);
  const { logout, getout, removeToken, removeUser, getUrl, api_url } =
    useContext(AuthContext);

  const getData = async (id, tok) => {
    await axios
      .get(`${api_url}/api/arbitros/poruser/${id}`, {
        headers: {
          Authorization: `Bearer ${tok}`,
        },
      })
      .then((res) => {
        setArbitro(res.data);
        setFoto(getUrl(res.data.imagenUrl));
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

  const [tokenData, setTokenData] = useState("");
  const [expire, setExpire] = useState(false);
  const [switcht, setSwitcht] = useState(false);
  const [loadData, setLoadData] = useState(true);
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("");
  const [id, setId] = useState("");
  const [noData, setNoData] = useState(false);
  const tokenCheckInterval = 5 * 60 * 1000; // 5 minutos

  // useRef para mantener el valor más reciente del token
  const tokenRef = useRef("");

  useEffect(() => {
    let intervalId;

    // Solicitar permisos para notificaciones
    const requestNotificationPermission = () => {
      if (Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            console.log("Permiso concedido para notificaciones");
          }
        });
      }
    };

    // Llamada a la función de solicitud de permisos
    requestNotificationPermission();

    //Eso lo puedes quitar si quieres ☝️

    const fetchToken = async () => {
      try {
        setLoadData(true);
        const fetchedToken = await getToken();
        const rol = await getUserRole();
        const correo = await getUserEmail();
        const id = await getUserId();
        if (rol !== "ROLE_ARBITRO") {
          setNoData(true);
          return;
        }
        if (fetchedToken) {
          setTokenData(fetchedToken);
          tokenRef.current = fetchedToken; // Actualizar el token más reciente
          validateToken(fetchedToken); //Verifica que el token esté disponible
          getData(id, fetchedToken);
          programarAlertaExpiracion(fetchedToken); // 👈 aquí
          setRol(rol);
          setCorreo(correo);
          setId(id);
          setNoData(false);
          //Aqui ya tienes lo que necesitas de datos creo
        } else {
          setNoData(true); //Si no encontró algun dato
        }
      } catch (error) {
        setNoData(true);
      } finally {
        setLoadData(false);
      }
    };

    const validateToken = (token) => {
      if (!token) {
        setExpire(true);
        return;
      }

      const expirationDate = decodeToken(token);
      const currentDate = new Date();

      if (!expirationDate || expirationDate < currentDate) {
        setExpire(true);
        if (Notification.permission === "granted") {
          const notif = new Notification("¡Sesión expirada! ❌", {
            body: "Haz click aqui para iniciar sesión nuevamente",
            icon: Logo1,
            priority: "high",
            vibrate: [200, 100, 200],
          });
          notif.onclick = () => {
            window.location.href = "/acceder";
          };
        }
      } else {
        setExpire(false);
        console.log("Sesión activa ✅");
      }
    };

    fetchToken(); // Ejecutar al montar el componente

    // Verificar cada 5 minutos con el token más reciente
    intervalId = setInterval(() => {
      validateToken(tokenRef.current);
    }, tokenCheckInterval);

    return () => clearInterval(intervalId); // Limpiar intervalo al desmontar
  }, [switcht]);

  const FIVE_MINUTES = 5 * 60 * 1000;

  const programarAlertaExpiracion = (token) => {
    const expirationDate = decodeToken(token);
    const currentDate = new Date();

    if (!expirationDate || expirationDate < currentDate) {
      setExpire(true);
      return;
    }

    const tiempoRestante = expirationDate - currentDate;
    const tiempoAntesDeExpirar = tiempoRestante - FIVE_MINUTES;

    if (tiempoAntesDeExpirar <= 0) {
      // Ya estamos a menos de 5 minutos o expirado
      notificarExpiracionCercana();
    } else {
      setTimeout(() => {
        notificarExpiracionCercana();
      }, tiempoAntesDeExpirar);
    }
  };

  const notificarExpiracionCercana = () => {
    if (Notification.permission === "granted") {
      const notif = new Notification("¡Atención!", {
        body: "Tu sesión finalizará en menos de 5 minutos",
        icon: Logo1,
        priority: "high",
        vibrate: [200, 100, 200],
        actions: [{ action: "cerrar", title: "Cerrar" }],
      });
    }
  };

  useEffect(() => {
    document.title = "Arbitros";
  }, []);

  if (loadData) {
    return <LoadingScreen />;
  }

  if (noData) {
    return <NoAuthPage />;
  }

  if (expire) {
    return (
      <TokenPage
        removeToken={removeToken}
        removeUser={removeUser}
        logout={logout}
        getout={getout}
      />
    );
  }

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
      <header className="py-2 px-3">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start gap-1">
          <a className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
            <img src={miImagen} width={100} height={50} alt="Logo" />
          </a>

          <span className="fs-4 text-white nav col-12 col-lg-8 me-lg-auto mb-2 align-items-center justify-content-center mb-md-0">
            Sistema de registro de partidos
          </span>

          <div className="text-end">
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
                      Object.keys(arbitro).length !== 0
                        ? foto
                        : //"https://www.meme-arsenal.com/memes/a513f913ef43476bd2b494da4e599cbc.jpg"
                          userPlace
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
