import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "bootstrap";
import { AuthContext } from "../../context/AuthContext";
import Banner1 from "../../assets/templates/banner_back.png";
import "../../assets/fonts/Oswald-Variable-normal";
import "../../assets/fonts/3rd Man-normal";
import Logo2 from "../../img/logo1.png";

export default function UsuarioCarrusel() {
  const getUrlDrive = (url) => {
    let idMatch = url.match(/id=([^&]+)/);
    if (!idMatch) {
      idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    }
    return idMatch
      ? `https://drive.google.com/uc?export=view&id=${idMatch[1]}`
      : url;
  };

  const [torneos, setTorneos] = useState([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const getTorneos = async () => {
      setLoad(true);
      axios
        .get(`${api_url}/api/torneos/espera`)
        .then((res) => {
          setTorneos(res.data);
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
        })
        .finally(() => {
          setLoad(false);
        });
    };
    getTorneos();
  }, []);

  const renderTorneoToDataURL = (torneo) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 150;
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const fondo = new Image();
      fondo.src = Banner1;

      fondo.onload = async () => {
        ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";

        ctx.font = "bold 36px '3rd Man', sans-serif";
        ctx.fillText(`Torneo ${torneo.nombreTorneo}`, 250, 35);
        ctx.font = "20px '3rd Man', sans-serif";
        ctx.fillText(`Fecha de inicio: ${torneo.fechaInicio}`, 835, 140);
        ctx.fillStyle = "black";
        ctx.font = "20px '3rd Man', sans-serif";
        ctx.fillText(torneo.descripcion, 250, 75);
        ctx.fillStyle = "#9A0000";
        ctx.font = "18px '3rd Man', sans-serif";
        ctx.fillText(
          `¡Sólo ${torneo.equiposLiguilla} pasarán a liguilla!`,
          300,
          135
        );

        const logo = new Image();

        //logo.src = getUrlDrive(selection.logoTorneo);
        console.log(getUrlDrive(torneo.logoTorneo)); // Verifica la URL generada

        //logo.src = fotoPlace;
        logo.crossOrigin = "Anonymous"; // Intentar con CORS habilitado

        logo.src = `https://cors-anywhere.herokuapp.com/${getUrlDrive(
          torneo.logoTorneo
        )}`;

        logo.onload = () => {
          ctx.drawImage(logo, 860, 10, 100, 100);
          const imgUrl = canvas.toDataURL("image/png");
        };

        logo.onerror = (e) => {
          console.error("No se pudo cargar la imagen del torneo");
          logo.src = Logo2;
          const imgUrl = canvas.toDataURL("image/png");
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
