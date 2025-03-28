import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import DuenoHome from "./DuenoHome";
import DuenoEquipos from "./DuenoEquipos";
import DuenoJugadores from "./DuenoJugadores";
import DuenoPagos from "./DuenoPagos";

import LoadingScreen from "../LoadingScreen";
import TokenPage from "../componentesExternos/TokenPage";
import NoAuthPage from "../componentesExternos/NoAuthPage";

//Aqui no muevas nada, es una especie de contexto para las 4 pantallas del dueño
//Aqui si quieres puedes declarar las variables que van a compartir y se las pasas como parametros
//Aqui ya está hecho la validación del token tambien

export default function DuenoContexto() {
  const { getToken, decodeToken, getUserEmail, getUserRole, getUserId } =
    useContext(AuthContext);
  const { logout, removeToken, removeUser, getUrl, api_url } =
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
          console.log(fetchedToken, "obtenido");
          validateToken(fetchedToken); //Verifica que el token esté disponible
          setRol(rol);
          setCorreo(correo);
          setId(id);
          setNoData(false);
          //Aqui ya tienes lo que necesitas de datos creo
        } else {
          console.log("Token no encontrado o está vacío.");
          setNoData(true); //Si no encontró algun dato
        }
      } catch (error) {
        console.log("Error al obtener el token:", error);
        setNoData(true);
      } finally {
        setLoadData(false);
      }
    };

    const validateToken = (token) => {
      if (!token) {
        setExpire(true);
        console.log("Token inválido ❌");
        return;
      }

      const expirationDate = decodeToken(token);
      const currentDate = new Date();

      if (!expirationDate || expirationDate < currentDate) {
        setExpire(true);
        console.log("El token ha expirado ❌");
        //Si quitaste lo de las notificaciones, quita esto
        if (Notification.permission === "granted") {
          const notif = new Notification("¡Hola!", {
            body: "El token ha expirado ❌",
            icon: miImagen,
          });
          notif.onclick = () => {
            window.open("http://localhost:5173/acceso", "_blank");
          };
        }
      } else {
        setExpire(false);
        console.log("Token válido ✅");
        //Si quitaste lo de las notificaciones, quita esto
        if (Notification.permission === "granted") {
          new Notification("¡Hola!", {
            body: "Token válido ✅",
            icon: miImagen,
          });
        }
      }
    };

    fetchToken(); // Ejecutar al montar el componente

    // Verificar cada 5 minutos con el token más reciente
    intervalId = setInterval(() => {
      console.log("Revisando expiración del token...");
      validateToken(tokenRef.current);
    }, tokenCheckInterval);

    return () => clearInterval(intervalId); // Limpiar intervalo al desmontar
  }, [switcht]);

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
      />
    );
  }

  return <>{renderizarComponente()}</>;
}
