import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import DuenoHome from "./DuenoHome";
import DuenoEquipos from "./DuenoEquipos";
import DuenoJugadores from "./DuenoJugadores";
import DuenoPagos from "./DuenoPagos";
import DuenoHistorial from "./DuenoHistorial";
import miImagen from "../../img/logo1.png";
import "../../css/dueno.css";
import "../../css/fonts.css";

import LoadingScreen from "../LoadingScreen";
import TokenPage from "../componentesExternos/TokenPage";
import NoAuthPage from "../componentesExternos/NoAuthPage";

import { AuthContext } from "../../context/AuthContext";

//Aqui no muevas nada, es una especie de contexto para las 4 pantallas del dueño
//Aqui si quieres puedes declarar las variables que van a compartir y se las pasas como parametros
//Aqui ya está hecho la validación del token tambien

export default function DuenoContexto() {
  const { getToken, decodeToken, getUserEmail, getUserRole, getUserId } =
    useContext(AuthContext);
  const { logout, getout, removeToken, removeUser, getUrl, api_url } =
    useContext(AuthContext);
  //getUrl la vas a usar para cargar las imagenes si sin de Google Drive, porque no deja
  //api_url es la url base de la api del .env

  const [tokenData, setTokenData] = useState("");
  const [expire, setExpire] = useState(false);
  const [switcht, setSwitcht] = useState(false);
  const [loadData, setLoadData] = useState(true);
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("");
  const [id, setId] = useState("");
  const [noData, setNoData] = useState(false);
  const tokenCheckInterval = 5 * 60 * 1000; // 5 minutos

  useEffect(() => {
    document.title = "Dueños";
  }, []);

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
        if (rol !== "ROLE_DUENO") {
          setNoData(true);
          return;
        }
        if (fetchedToken) {
          setTokenData(fetchedToken);
          tokenRef.current = fetchedToken; // Actualizar el token más reciente
          validateToken(fetchedToken); //Verifica que el token esté disponible
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
            icon: miImagen,
            priority: "high",
            vibrate: [200, 100, 200],
          });
          notif.onclick = () => {
            window.location.href = "/acceso";
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
        icon: miImagen,
        priority: "high",
        vibrate: [200, 100, 200],
        actions: [{ action: "cerrar", title: "Cerrar" }],
      });
    }
  };

  const [expand, setExpand] = useState(false);

  //Por ejemplo, este es para cambiar el componente visible, y lo hereda a los otros componentes
  const [componenteActual, setComponenteActual] = useState("A");
  const renderizarComponente = () => {
    switch (componenteActual) {
      case "A":
        return <DuenoHome cambiarComponente={setComponenteActual} />;
      case "B":
        return <DuenoEquipos cambiarComponente={setComponenteActual} />;
      case "C":
        return <DuenoJugadores cambiarComponente={setComponenteActual} />;
      case "D":
        return <DuenoPagos cambiarComponente={setComponenteActual} />;
      case "E":
        return <DuenoHistorial cambiarComponente={setComponenteActual} />;
      default:
        return <DuenoHome cambiarComponente={setComponenteActual} />; //Inicia por default en 'home'
    }
  };

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

  return (
    <>
      <div id="dueno">
        <aside className={`dSidebar ${expand ? "open" : "closed"}`}>
          <div className="dSidebar-header">
            <img src={miImagen} alt="logo" />
            <h2>
              <span>Leagues hub</span>
            </h2>
          </div>
          <ul className="dSidebar-links">
            <li>
              <a
                className={`${componenteActual === "A" && "activo"}`}
                onClick={() => setComponenteActual("A")}
              >
                <i className="fa fa-home icon mi" aria-hidden="true"></i>
                Inicio
              </a>
            </li>
            <li>
              <a
                className={`${componenteActual === "B" && "activo"}`}
                onClick={() => setComponenteActual("B")}
              >
                <i className="fa fa-shield icon mi" aria-hidden="true"></i>
                Mis equipos
              </a>
            </li>
            <li>
              <a
                className={`${componenteActual === "C" && "activo"}`}
                onClick={() => setComponenteActual("C")}
              >
                <i className="fa fa-users icon mi" aria-hidden="true"></i>
                Jugadores
              </a>
            </li>
            <li>
              <a
                className={`${componenteActual === "D" && "activo"}`}
                onClick={() => setComponenteActual("D")}
              >
                <i className="fa fa-wallet icon mi" aria-hidden="true"></i>
                Pagos
              </a>
            </li>
            <li>
              <a
                className={`${componenteActual === "E" && "activo"}`}
                onClick={() => setComponenteActual("E")}
              >
                <i className="fa fa-book icon mi" aria-hidden="true"></i>
                Historial
              </a>
            </li>
            <li id="hidden" className="sidebar-toggle">
              <a onClick={() => setExpand(!expand)} id="sidebar-toggle">
                <i
                  className={`fa ${
                    !expand ? "fa-arrow-left" : "fa-arrow-right"
                  } icon mi`}
                  aria-hidden="true"
                ></i>
              </a>
            </li>
          </ul>
          {/* Si lo quieres usar, descomentalo */}
          {/* <div className="usuario-cuenta">
            <div className="usuario-perfil">
              <img
                src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                alt="Foto"
              />
              <div className="usuario-detallle">
                <h3 className="ml-1">Nombre del dueño</h3>
                <span>correo@example.com</span>
              </div>
            </div>
          </div> */}
        </aside>
        <div className="w-100 overflow-hidden">
          {/* Topbar */}
          <nav
            className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow w-100"
            id="navbar"
          >
            <p className="text-white m-2 p-head">Menú de dueños de equipos</p>

            <ul className="navbar-nav ml-auto">
              <li className="nav-item dropdown no-arrow mx-auto">
                <a
                  className="nav-link dropdown-toggle gray-back ali"
                  id="alertsDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  <i className="fa-regular en-fa fa-bell fa-fw"></i>
                  <span className="badge badge-danger badge-counter">3+</span>
                </a>

                <div
                  className="dropdown-list dropdown-menu shadow animated--grow-in"
                  aria-labelledby="alertsDropdown"
                >
                  <h6 className="dropdown-header">Notificaciones</h6>
                  <a className="dropdown-item d-flex align-items-center">
                    <div className="mr-3">
                      <div className="icon-circle bg-primary">
                        <i className="fas en-fa fa-file-alt text-white h-100"></i>
                      </div>
                    </div>
                    <div>
                      <div className="small text-gray-500">
                        December 12, 2019
                      </div>
                      <span className="font-weight-bold">
                        A new monthly report is ready to download!
                      </span>
                    </div>
                  </a>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <div className="mr-3">
                      <div className="icon-circle bg-success">
                        <i className="fas en-fa fa-donate h-100 text-white"></i>
                      </div>
                    </div>
                    <div>
                      <div className="small text-gray-500">
                        December 7, 2019
                      </div>
                      $290.29 has been deposited into your account!
                    </div>
                  </a>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <div className="mr-3">
                      <div className="icon-circle bg-warning">
                        <i className="fas en-fa fa-exclamation-triangle h-100 text-white"></i>
                      </div>
                    </div>
                    <div>
                      <div className="small text-gray-500">
                        December 2, 2019
                      </div>
                      Spending Alert: We've noticed unusually high spending for
                      your account.
                    </div>
                  </a>
                  <a
                    className="dropdown-item text-center small text-gray-500"
                    href="#"
                  >
                    Show All Alerts
                  </a>
                </div>
              </li>

              <li className="nav-item dropdown no-arrow mx-1">
                <a
                  className="nav-link dropdown-toggle ali"
                  href="#"
                  id="messagesDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="fa-regular en-fa fa-envelope fa-fw"></i>
                  <span className="badge badge-danger badge-counter">7</span>
                </a>

                <div
                  className="dropdown-list dropdown-menu shadow animated--grow-in"
                  aria-labelledby="messagesDropdown"
                  id="messagesCenter"
                >
                  <h6 className="dropdown-header">Solicitudes</h6>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <div className="dropdown-list-image mr-1">
                      <img
                        className="rounded-circle"
                        src="img/undraw_profile_1.svg"
                        alt="..."
                      />
                      <div className="status-indicator bg-success"></div>
                    </div>
                    <div>
                      <div className="text-truncate">
                        Hi there! I am wondering if you can help me with a
                        problem I've been having.
                      </div>
                      <div className="small text-gray-500">
                        Emily Fowler · 58m
                      </div>
                    </div>
                  </a>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <div className="dropdown-list-image mr-1">
                      <img
                        className="rounded-circle"
                        src="img/undraw_profile_2.svg"
                        alt="..."
                      />
                      <div className="status-indicator bg-success"></div>
                    </div>
                    <div>
                      <div className="text-truncate">
                        I have the photos that you ordered last month, how would
                        you like them sent to you?
                      </div>
                      <div className="small text-gray-500">Jae Chun · 1d</div>
                    </div>
                  </a>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <div className="dropdown-list-image mr-1">
                      <img
                        className="rounded-circle"
                        src="img/undraw_profile_3.svg"
                        alt="..."
                      />
                      <div className="status-indicator bg-success"></div>
                    </div>
                    <div>
                      <div className="text-truncate">
                        Last month's report looks great, I am very happy with
                        the progress so far, keep up the good work!
                      </div>
                      <div className="small text-gray-500">
                        Morgan Alvarez · 2d
                      </div>
                    </div>
                  </a>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <div className="dropdown-list-image mr-1">
                      <img
                        className="rounded-circle"
                        src="img/undraw_profile_4.svg"
                        alt="..."
                      />
                      <div className="status-indicator bg-success"></div>
                    </div>
                    <div>
                      <div className="text-truncate">
                        Am I a good boy? The reason I ask is because someone
                        told me that people say this to all dogs, even if they
                        aren't good...
                      </div>
                      <div className="small text-gray-500">
                        Chicken the Dog · 2w
                      </div>
                    </div>
                  </a>
                  <a
                    className="dropdown-item text-center small text-gray-500"
                    href="#"
                  >
                    Read More Messages
                  </a>
                </div>
              </li>

              <div className="topbar-divider d-none d-sm-block"></div>

              <li className="nav-item duenolink dropdown no-arrow">
                <a
                  className="nav-link dropdown-toggle head-a"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span className="mr-3 d-none d-lg-inline small text-white-600">
                    Usuario #0000000001
                  </span>
                  <img
                    className="img-profile rounded-circle"
                    src="https://www.meme-arsenal.com/memes/a513f913ef43476bd2b494da4e599cbc.jpg"
                    alt="..."
                  />
                </a>

                <div
                  className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                  aria-labelledby="userDropdown"
                >
                  <a
                    className="dropdown-item"
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
          </nav>
          {/* Componente elegido */}
          {renderizarComponente()}
          {/* Footer */}
        </div>
      </div>
      <footer className="sticky-footer bg-base mt-0">
        <span>Copyright &copy; Leagues Hub 2025</span>
        <a href="https://lordicon.com/">Icons by Lordicon.com</a>
      </footer>
    </>
  );
}
