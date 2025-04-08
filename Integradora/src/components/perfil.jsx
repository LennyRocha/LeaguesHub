import React, { useEffect, useState, useContext, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../css/perfil.css";
import "../css/fonts.css";
import PerfilAppBar from "./perfil/PerfilHeader";
import { TextField } from "@mui/material";
import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";
import "bootstrap";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Tooltip from "@mui/material/Tooltip";
import Swal from "sweetalert2";
import userPlace from "../assets/images/user-placeholder.png";
import LoadingScreen from "./LoadingScreen";
import NoAuthPage from "./componentesExternos/NoAuthPage";
import TokenPage from "./componentesExternos/TokenPage";

export default function Perfil({ cambiarComponente }) {
  const [preview, setPreview] = useState(userPlace);

  const { getToken, decodeToken, getUserEmail, getUserRole, getUserId } =
    useContext(AuthContext);
  const { logout, getout, removeToken, removeUser, getUrl, api_url } =
    useContext(AuthContext);

  const [rol, setRol] = useState(false);
  const [hasText, setHasText] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [user, setUser] = useState({});
  const [userName, setUserName] = useState('');
  const [userPass, setUserPass] = useState('');

  const handleInput = (e) => {
    setHasText(e.target.value.trim() !== "");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const getData = async (id, tok, rol) => {
    let rol_api = "";
    if (rol === "ROLE_ARBITRO") {
      rol_api = "arbitros/poruser";
    } else if (rol === "ROLE_DUENO") {
      rol_api = "duenos/porusuario";
    }
    await axios
      .get(`${api_url}/api/${rol_api}/${id}`, {
        headers: {
          Authorization: `Bearer ${tok}`,
        },
      })
      .then((res) => {
        setPreview(getUrl(res.data.imagenUrl));
        setUser(res.data);
        setUserName(res.data.nombreCompleto);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          text: "No se pudierón recuperar tus datos",
          timer: 2500,
          showConfirmButton: false,
        });
        console.error(err);
      });
  };

  const [tokenData, setTokenData] = useState("");
  const [expire, setExpire] = useState(false);
  const [switcht, setSwitcht] = useState(false);
  const [loadData, setLoadData] = useState(true);
  const [correo, setCorreo] = useState("");
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
        if (fetchedToken) {
          setTokenData(fetchedToken);
          tokenRef.current = fetchedToken; // Actualizar el token más reciente
          validateToken(fetchedToken); //Verifica que el token esté disponible
          getData(id, fetchedToken, rol);
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
        icon: Logo1,
        priority: "high",
        vibrate: [200, 100, 200],
        actions: [{ action: "cerrar", title: "Cerrar" }],
      });
    }
  };

  useEffect(() => {
    document.title = "Mi perfil";
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

  return (
    <div className="h-min">
      <PerfilAppBar rol={rol} />
      <div id="perfil_container">
        <div id="back_div"></div>
        <div className="update-picture container-fluid">
          <div className="foto2">
            <img src={preview} alt="Foto de perfil" id="selPictu" />
            <Tooltip title="Actualizar perfil">
              <div className="buttonDiv">
                <input
                  type="file"
                  className="botonCama"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <i className="fa fa-image"></i>
              </div>
            </Tooltip>
          </div>
        </div>
        <form action="" id="profForm" className="w-100 align-items-center">
          <h4 className="userType mb-2">
            Tipo de usuario:{" "}
            <b
              className={rol === "ROLE_ARBITRO" ? "role3" : "role2" || "role0"}
            >
              {rol === "ROLE_ARBITRO"
                ? "Árbitro"
                : "Dueño de equipos" || "Usuario"}
            </b>
          </h4>
          <div className="row">
            <h4>Datos personales</h4>
            <div className="col-md-4">
              <TextField
                name="email"
                label="Correo electrónico"
                fullWidth
                margin="dense"
                className="txtField readonly"
                inputProps={{ readOnly: true }}
                value={correo}
              />
            </div>
            <div className="col-md-4">
              <TextField
                name="name"
                label="Nombre"
                fullWidth
                margin="dense"
                className="txtField"
                value={userName}
                onInput={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <TextField
                name="new"
                label="Nueva contraseña"
                fullWidth
                margin="dense"
                className="txtField"
                type="password"
              />
            </div>
          </div>
          <br />
          <div className="row container-fluid" id="buttonRow">
            <button
              type="submit"
              name="updateP"
              className="slide-btn-sm w-25 text-black"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
