import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "bootstrap";
import { AuthContext } from "../../context/AuthContext";

// Asegúrate de importar tu imagen base (el fondo)
import Banner1 from "./ruta/tuImagenFondo.jpg"; // ajusta la ruta

export default function UsuarioCarrusel({ torneos }) {
  const getUrlDrive = (url) => {
    let idMatch = url.match(/id=([^&]+)/);
    if (!idMatch) {
      idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    }
    return idMatch
      ? `https://drive.google.com/uc?export=view&id=${idMatch[1]}`
      : url;
  };
  
  useEffect(() => {
    const getTorneos = async () => {
      axios
        .get(`${api_url}/api/torneos/espera`)
        .then((res) => {
          if (res.data.length === 0) setTorEspera(0);
          else setTorEspera(res.data.length);
        })
        .catch((e) => {
          console.error(e, e.response.message);
          if (e.response.status === 403) {
            console.log("⚠️ Token expirado, redirigiendo a login...");
            Swal.fire({
              icon: "warning",
              title: "¡Denegado!",
              text: "Su sesión ha expirado, ingrese sesión nuevamente para continuar",
              confirmButtonText: "Aceptar",
              customClass: {
                confirmButton: "btn-confirm",
                cancelButton: "btn-cancel",
                denyButton: "btn-deny",
              },
            }).then((resutlt) => logout());
            return;
          }
          setTorEspera(0);
        })
        .finally(() => {
          setLoad4(false);
        });
    };
    getTorneos();
  }, []);

  const renderTorneoToDataURL = (torneo) => {
    return new Promise((resolve) => {
      const canvas = document.getElementById("canvasBase");
      const ctx = canvas.getContext("2d");

      const fondo = new Image();
      fondo.src = Banner1;

      fondo.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "bold 36px sans-serif";
        ctx.fillText(`Torneo ${torneo.nombreTorneo}`, 250, 35);
        ctx.font = "20px sans-serif";
        ctx.fillText(`Fecha de inicio: ${torneo.fechaInicio}`, 835, 140);
        ctx.fillStyle = "black";
        ctx.fillText(torneo.descripcion, 250, 75);
        ctx.fillStyle = "#9A0000";
        ctx.fillText(
          `¡Sólo ${torneo.equiposLiguilla} pasarán a liguilla!`,
          300,
          135
        );

        const logo = new Image();
        logo.crossOrigin = "anonymous";
        logo.src = getUrlDrive(torneo.logoTorneo);

        logo.onload = () => {
          ctx.drawImage(logo, 860, 10, 100, 100);
          resolve(canvas.toDataURL("image/png"));
        };

        logo.onerror = () => {
          console.error("Error al cargar el logo");
          resolve(canvas.toDataURL("image/png")); // sin logo
        };
      };

      fondo.onerror = () => {
        console.error("Error al cargar el fondo");
        resolve("");
      };
    });
  };

  const [imagenes, setImagenes] = useState([]);

  const { getUserId, getUserRole, getToken, logout, api_url, getUrl } =
    useContext(AuthContext);

  useEffect(() => {
    const renderAll = async () => {
      const dataUrls = await Promise.all(torneos.map(renderTorneoToDataURL));
      setImagenes(dataUrls);
    };

    if (torneos.length > 0) {
      renderAll();
    }
  }, [torneos]);

  return (
    <>
      <canvas
        id="canvasBase"
        width="1024"
        height="200"
        style={{ display: "none" }}
      ></canvas>

      <div id="torneos" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          {imagenes.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#torneos"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-current={index === 0}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>

        <div className="carousel-inner">
          {imagenes.map((src, index) => (
            <div
              key={index}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
              data-bs-interval="3000"
            >
              <img
                src={src}
                className="d-block w-100 img"
                alt={`Torneo ${index + 1}`}
              />
              <div className="overlay-dk">
                <h1>Torneo {index + 1}</h1>
              </div>
            </div>
          ))}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#torneos"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#torneos"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>
    </>
  );
}
