import React from "react";
import Swal from "sweetalert2";

import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";

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
  const getEstadoTorneo = (estado) => {
    switch (estado) {
      case "En curso": return "bg-warning"
      case "Cancelado": return "bg-info"
      case "Finalizado": return "bg-light"
      default: return "bg-light"
    }
  }
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
  return (
    <div>
      <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0">Torneos</h2>
        </div>
        <div className="overf-auto">
          {torneosOrdenados.map((t) => {
            return (
              <div className={`dueno-container-2 ${getEstadoTorneo(t.estado)}`} key={t.id}>
                {t.img ? <img src={t.img} alt={t.nombre} className="teamImage" /> :
                <lord-icon
                  src="https://cdn.lordicon.com/lewtedlh.json"
                  trigger="loop"
                  stroke="bold"
                  state="loop-roll"
                  colors="primary:#333333,secondary:#9A0000"
                  style={{ width: "50%", height: "50%" }}
                ></lord-icon>}
                <h5 className="w-100">Torneo "{t.nombre}"</h5>
                <button className="slide-btn-sm">Ver jugadores</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
