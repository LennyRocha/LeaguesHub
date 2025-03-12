import React, { useState } from "react";
import Swal from "sweetalert2";

import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
// import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// define "lord-icon" custom element with default properties
defineElement(lottie.loadAnimation);

const torneosPrueba = [
  {
    id: 1,
    nombre: "Mario Kart",
    fechaInicio: "02/02/2025",
    fechaFin: "10/02/2025",
    estado: "En curso",
    img: "",
    motivo: "",
    desc: "Hola",
    max: 10,
    min: 8,
    resul: "",
  },
  {
    id: 2,
    nombre: "El chavo",
    fechaInicio: "17/02/2025",
    fechaFin: "25/02/2025",
    estado: "En curso",
    img: "",
    motivo: "",
    desc: "Mundo",
    max: 12,
    min: 10,
    resul: "",
  },
  {
    id: 3,
    nombre: "UTEZ",
    fechaInicio: "28/02/2025",
    fechaFin: "07/03/2025",
    estado: "Finalizado",
    img: "",
    motivo: "",
    desc: "No se",
    max: 10,
    min: 12,
    resul: "Chivas",
  },
  {
    id: 4,
    nombre: "CECyTE",
    fechaInicio: "12/03/2025",
    fechaFin: "20/03/2025",
    estado: "Cancelado",
    img: "",
    motivo: "Sismo",
    desc: "Qué",
    max: 12,
    min: 14,
    resul: "",
  },
  {
    id: 5,
    nombre: "2022",
    fechaInicio: "24/03/2025",
    fechaFin: "01/04/2025",
    estado: "Finalizado",
    img: "",
    motivo: "",
    desc: "Poner",
    max: 14,
    min: 16,
    resul: "Pumas",
  },
  {
    id: 6,
    nombre: "Liuguilla",
    fechaInicio: "02/04/2025",
    fechaFin: "10/04/2025",
    estado: "Cancelado",
    img: "",
    motivo: "Balacera",
    desc: "Aquí",
    max: 16,
    min: 18,
    resul: "",
  },
];

export default function Admin3() {
  const [statColor, setStatColor] = useState("");
  const getEstadoTorneo = (estado) => {
    switch (estado) {
      case "En curso":
        return "torAct";
      case "Cancelado":
        return "torCancel";
      case "Finalizado":
        return "bg-light";
      default:
        return "torAct";
    }
  };
  const ordenEstados = ["En curso", "Finalizado", "Cancelado"];

  const torneosOrdenados = torneosPrueba.sort((a, b) => {
    const indexA = ordenEstados.indexOf(a.estado);
    const indexB = ordenEstados.indexOf(b.estado);

    if (indexA !== indexB) {
      return indexA - indexB;
    }

    const fechaA = new Date(a.fechaInicio.split("/").reverse().join("-"));
    const fechaB = new Date(b.fechaInicio.split("/").reverse().join("-"));

    return fechaA - fechaB;
  });

  const [preview, setPreview] = useState(
    "https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
  );

  function submitArbitro(e) {
    e.preventDefault();
    Swal.fire({
      icon: "success",
      title: "Datos guardados:",
      text: `Arbitro guardado con éxito`,
      customClass: {
        confirmButton: "btn-confirm",
        cancelButton: "btn-cancel",
        denyButton: "btn-deny",
      },
    });
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      console.log(file.name);
    }
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0">Torneos</h2>
        </div>
        <div className="overf-auto-2">
          {torneosOrdenados.map((t) => {
            return (
              <div
                className={`dueno-container-2 ${getEstadoTorneo(t.estado)}`}
                key={t.id}
              >
                <div className="torneo-head">
                  <h6
                    className={`${
                      t.estado === "En curso" ? "greenState" : ""
                    } ${t.estado === "Cancelado" ? "redState" : ""}`}
                  >
                    {t.estado}
                  </h6>

                  <h6>{t.fechaInicio}</h6>
                </div>
                {t.img ? (
                  <img src={t.img} alt={t.nombre} className="teamImage" />
                ) : (
                  <lord-icon
                    src="https://cdn.lordicon.com/lewtedlh.json"
                    trigger="loop"
                    stroke="bold"
                    state="loop-roll"
                    colors="primary:#333333,secondary:#9A0000"
                    style={{ width: "50%", height: "50%" }}
                  ></lord-icon>
                )}
                <h5 className="w-100">Torneo "{t.nombre}"</h5>
                {t.estado !== "Cancelado" ? null : (
                  <h6 className="aktive activeTxt aktive-h6">
                    Cancelado por: {t.motivo}
                  </h6>
                )}
                <div className="_row">
                  <button className="slide-btn-sm">Detalles</button>
                  <button className="slide-btn-sm">
                    {t.estado === "En curso" ? "Cancelar" : "Remover"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="row">
          <div className="col-lg-8">
            <div className="bg-light form-div">
              <div className="container-fluid">
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                  <h3 className="mb-0">Nuevo torneo</h3>
                </div>
              </div>
              <form>
                <div className="rowInp">
                  <TextField
                    fullWidth
                    label="Nombre del torneo"
                    className="txtAr txtCon mb-2"
                  />
                  <TextField
                    fullWidth
                    label="Premio"
                    className="txtAr txtCon mb-2"
                  />
                </div>
                <TextField
                  label="Descripción"
                  multiline
                  rows={6} // Número fijo de filas
                  fullWidth
                  className="txtAr txtCon mb-2"
                />
                <div className="rowInp">
                  <div>
                  <div className="fecha-label">Fecha de inicio</div>
                    <TextField
                      type="date"
                      fullWidth
                      inputProps={{
                        min: new Date().toLocaleDateString("sv-SE"),
                      }}
                      className="txtAr txtCon mb-2"
                    />
                  </div>
                  <div>
                    <div className="fecha-label">Fecha de fin</div>
                    <TextField
                      type="date"
                      fullWidth
                      inputProps={{
                        min: new Date().toLocaleDateString("sv-SE"),
                      }}
                      className="txtAr txtCon mb-2"
                    />
                  </div>
                </div>
                <div className="rowInp">
                  <TextField
                    fullWidth
                    label="# máximo de equipos"
                    type="number"
                    className="txtAr txtCon mb-2"
                  />
                  <TextField
                    fullWidth
                    label="# mínimo de equipos"
                    type="number"
                    className="txtAr txtCon mb-2"
                  />
                </div>
                <div className="button-group">
                  <button className="slide-btn">Crear torneo</button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card shadow mb-4">
              <div className="card-header py-3 bg-red container-fluid">
                <p className=" font-weight-bold body-small text-white ml-md-2">
                  Logo del torneo
                </p>
              </div>
              <div className="arbitro-card">
                <form onSubmit={(e) => submitArbitro(e)}>
                  <div className="fotoContainer">
                    <img className="img-fluid img" src={preview} alt="..." />
                    <Tooltip title="Elegir logo">
                      <div className="botonDiv-2">
                        <i className="fa fa-image"></i>
                        <input
                          type="file"
                          className="botonCam"
                          accept="image/*"
                          onChange={handleFileChange}
                          id="btnCam"
                        />
                      </div>
                    </Tooltip>
                  </div>
                  <h4 className="mt-1">Logo seleccionado</h4>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
