import React from "react";
import Tooltip from "@mui/material/Tooltip";
//import UsuarioMap  from "./UsuarioMap";
import UsuarioCarrusel from "./UsuarioCarrusel";
import UsuarioDestac from "./UsuarioDestac";
import UsuarioTabla1 from "./UsuarioTabla1";
import UsuarioTabla2 from "./UsuarioTabla2";
import "../../css/usuario.css";
import 'bootstrap'

const jugadoresPrueba = [
  {
    id: 1,
    nombre: "Jugador #001",
    goles: 9,
    partidos: 5,
    fallas: 0,
    img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
    activo: true,
  },
  {
    id: 2,
    nombre: "Jugador #002",
    goles: 3,
    partidos: 8,
    fallas: 0,
    img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
    activo: true,
  },
  {
    id: 3,
    nombre: "Jugador #003",
    goles: 6,
    partidos: 1,
    fallas: 0,
    img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
    activo: true,
  },
  {
    id: 4,
    nombre: "Jugador #004",
    goles: 10,
    partidos: 3,
    fallas: 0,
    img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
    activo: false,
  },
  {
    id: 5,
    nombre: "Jugador #005",
    goles: 9,
    partidos: 2,
    fallas: 0,
    img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
    activo: false,
  },
  {
    id: 6,
    nombre: "Jugador #006",
    goles: 2,
    partidos: 1,
    fallas: 1,
    img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
    activo: true,
  },
  {
    id: 7,
    nombre: "Jugador #007",
    goles: 0,
    partidos: 50,
    fallas: 50,
    img: "https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg",
    activo: true,
  },
];

const equipos = [
  {
    equipoId: 1,
    nombre: "Chivas",
    dt: {
      id: 1,
      nombre: "Juan Peréz",
      correo: "juanperez@hotmail.com",
      img: "https://th.bing.com/th/id/OIP.SVo8-p3WhGOnngP6K6tBsAHaKc?w=115&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    },
    imgId: "1-FOLUn9u4T-D5ggneCO0nZm4jOOVXItI",
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1-FOLUn9u4T-D5ggneCO0nZm4jOOVXItI",
  },
  {
    equipoId: 2,
    nombre: "Cruz Azul",
    dt: {
      id: 2,
      nombre: "Mauro Bahena",
      correo: "maurodfr@hotmail.com",
      img: "https://i.pinimg.com/originals/55/45/e2/5545e27dd7441dc888fa6e4669421bdc.png",
    },
    imgId: "1L4y6YuAZuIYWEOlWr0sBKmoutcMFyG54",
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1L4y6YuAZuIYWEOlWr0sBKmoutcMFyG54",
  },
  {
    equipoId: 3,
    nombre: "Monterrey",
    dt: {
      id: 1,
      nombre: "Nick Fury",
      correo: "vengadores@hotmail.com",
      img: "https://th.bing.com/th/id/OIP.YoIWYEmDFaQof1wx6j8xBQHaKp?w=132&h=190&c=7&pcl=1b1a19&r=0&o=5&dpr=1.5&pid=1.7",
    },
    imgId: "1L_u5cuRI6pI78YOb-0PIt_vovmV8SLLX",
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1L_u5cuRI6pI78YOb-0PIt_vovmV8SLLX",
  },
  {
    equipoId: 4,
    nombre: "Necaxa",
    dt: {
      id: 1,
      nombre: "Don Ramón",
      correo: "mochito@gmail.com",
      img: "https://th.bing.com/th/id/OIP.iox5J2IefKpTqQ3A0PovKwAAAA?rs=1&pid=ImgDetMain",
    },
    imgId: "1_bDUfg2szuTCPy6onk37wSbzOoZGyhWW",
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1_bDUfg2szuTCPy6onk37wSbzOoZGyhWW",
  },
  {
    equipoId: 5,
    nombre: "Pumas",
    dt: {
      id: 1,
      nombre: "Francisco Pulido",
      correo: "camarapaino@utez.edu.mx",
      img: "https://th.bing.com/th/id/OIP.crgqPqen60BHAPwu_jzyAgHaNK?rs=1&pid=ImgDetMain",
    },
    imgId: "1IdFsp723ipbBX95PWsXwpURsO5L4jGei",
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1IdFsp723ipbBX95PWsXwpURsO5L4jGei",
  },
  {
    equipoId: 6,
    nombre: "America",
    dt: {
      id: 1,
      nombre: "Daniel Aguilar",
      correo: "daniel@aguilar.com",
      img: "https://th.bing.com/th/id/OIP.9Uh0RFprWijPzuoxR2tcBQHaNL?w=115&h=181&c=7&pcl=1b1a19&r=0&o=5&dpr=1.5&pid=1.7",
    },
    imgId: "1hLeMo386b05HrRd2mruNXZZqlWJ_EbSC",
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1hLeMo386b05HrRd2mruNXZZqlWJ_EbSC",
  },
  {
    equipoId: 7,
    nombre: "Atlas",
    dt: {
      id: 1,
      nombre: "El piojo Herrera",
      correo: "elpiojitoxd@gmail.com",
      img: "https://th.bing.com/th/id/OIP.vEf5l5SjcnsD1mhWGM2uRAAAAA?rs=1&pid=ImgDetMain",
    },
    imgId: "1yeIzWN8Wl6TvIrEtqci874SU7MT6E8cg",
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1yeIzWN8Wl6TvIrEtqci874SU7MT6E8cg",
  },
  {
    equipoId: 8,
    nombre: "Tigres",
    dt: {
      id: 1,
      nombre: "Tigre Toño",
      correo: "grrriquisimas@hotmail.com",
      img: "https://tecolotito.elsiglodetorreon.com.mx/i/2010/05/204363.jpeg",
    },
    imgId: "1HMF63odQw9WzQdVmfFbSP1H3_F8qY-uV",
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1HMF63odQw9WzQdVmfFbSP1H3_F8qY-uV",
  },
];

const partidosPrueba = [
  {
    id: 1,
    lugar: "Mario Kart",
    fecha: "02/02/2025",
    estado: "Nuevo",
    equipo1: {
      nombre: "Pumas",
      img: "https://drive.google.com/uc?export=view&id=1IdFsp723ipbBX95PWsXwpURsO5L4jGei",
    },
    equipo2: {
      nombre: "Chivas",
      img: "https://drive.google.com/uc?export=view&id=1-FOLUn9u4T-D5ggneCO0nZm4jOOVXItI",
    },
  },
  {
    id: 2,
    lugar: "El chavo",
    fecha: "17/02/2025",
    estado: "Nuevo",
    equipo1: {
      nombre: "Pumas",
      img: "https://drive.google.com/uc?export=view&id=1IdFsp723ipbBX95PWsXwpURsO5L4jGei",
    },
    equipo2: {
      nombre: "America",
      img: "https://drive.google.com/uc?export=view&id=1hLeMo386b05HrRd2mruNXZZqlWJ_EbSC",
    },
  },
  {
    id: 3,
    lugar: "UTEZ",
    fecha: "28/02/2025",
    estado: "Finalizado",
    equipo1: {
      nombre: "Monterrey",
      img: "https://drive.google.com/uc?export=view&id=1L_u5cuRI6pI78YOb-0PIt_vovmV8SLLX",
    },
    equipo2: {
      nombre: "Tigres",
      img: "https://drive.google.com/uc?export=view&id=1HMF63odQw9WzQdVmfFbSP1H3_F8qY-uV",
    },
  },
  {
    id: 4,
    lugar: "CECyTE",
    fecha: "12/03/2025",
    estado: "Finalizado",
    equipo1: {
      nombre: "Chivas",
      img: "https://drive.google.com/uc?export=view&id=1-FOLUn9u4T-D5ggneCO0nZm4jOOVXItI",
    },
    equipo2: {
      nombre: "Monterrey",
      img: "https://drive.google.com/uc?export=view&id=1L_u5cuRI6pI78YOb-0PIt_vovmV8SLLX",
    },
  },
  {
    id: 5,
    lugar: "2022",
    fecha: "24/03/2025",
    estado: "Finalizado",
    equipo1: {
      nombre: "Necaxa",
      img: "https://drive.google.com/uc?export=view&id=1_bDUfg2szuTCPy6onk37wSbzOoZGyhWW",
    },
    equipo2: {
      nombre: "Atlas",
      img: "https://drive.google.com/uc?export=view&id=1yeIzWN8Wl6TvIrEtqci874SU7MT6E8cg",
    },
  },
  {
    id: 6,
    lugar: "Liuguilla",
    fecha: "02/04/2025",
    estado: "Nuevo",
    equipo1: {
      nombre: "Chivas",
      img: "https://drive.google.com/uc?export=view&id=1-FOLUn9u4T-D5ggneCO0nZm4jOOVXItI",
    },
    equipo2: {
      nombre: "America",
      img: "https://drive.google.com/uc?export=view&id=1hLeMo386b05HrRd2mruNXZZqlWJ_EbSC",
    },
  },
  {
    id: 7,
    lugar: "Chiapas",
    fecha: "02/04/2025",
    estado: "Nuevo",
    equipo1: {
      nombre: "Monterrey",
      img: "https://drive.google.com/uc?export=view&id=1L_u5cuRI6pI78YOb-0PIt_vovmV8SLLX",
    },
    equipo2: {
      nombre: "America",
      img: "https://drive.google.com/uc?export=view&id=1hLeMo386b05HrRd2mruNXZZqlWJ_EbSC",
    },
  },
  {
    id: 8,
    lugar: "Morelos",
    fecha: "02/04/2025",
    estado: "Nuevo",
    equipo1: {
      nombre: "Necaxa",
      img: "https://drive.google.com/uc?export=view&id=1_bDUfg2szuTCPy6onk37wSbzOoZGyhWW",
    },
    equipo2: {
      nombre: "Pumas",
      img: "https://drive.google.com/uc?export=view&id=1IdFsp723ipbBX95PWsXwpURsO5L4jGei",
    },
  },
];

export default function UsuarioMain({ cambiarComponente }) {
  return (
    <div id="main">
      <div className="rowTeams" id="inicio">
        {equipos.map((e, index) => {
          return (
            <div key={e.equipoId}>
              <Tooltip title={e.nombre}>
                <img
                  src={`https://lh3.googleusercontent.com/d/1L4y6YuAZuIYWEOlWr0sBKmoutcMFyG54=s220`}
                  alt={e.nombre}
                  width={40}
                  height={40}
                />
              </Tooltip>
            </div>
          );
        })}
      </div>
      {/*<div className="partidoFilter">
        <h2>Filtrar: </h2>
        <button>Actuales</button>
        <button>Anteriores</button>
      </div>*/}
      <div className="partidoRow" id="partidos">
        {partidosPrueba.map((p, index) => {
          return (
            <div className="partidoCard" key={p.id}>
              <div className="partidoCardHeader">
                <img
                  src={`https://lh3.googleusercontent.com/d/1L4y6YuAZuIYWEOlWr0sBKmoutcMFyG54=s220`}
                  alt="LogoTor"
                  width={40}
                  height={40}
                />
                <h5>{p.lugar}</h5>
              </div>
              <div className="partidoCardBody">
                <div className="partidoDataRow">
                  <b>Dom, 9 de Marzo</b>
                </div>
                <div className="partidoDataRow">
                  <div>
                    <img
                      src={`https://lh3.googleusercontent.com/d/1L4y6YuAZuIYWEOlWr0sBKmoutcMFyG54=s220`}
                      alt="Local"
                      width={40}
                      height={40}
                    />
                    <p>{p.equipo1.nombre}</p>
                  </div>
                  <h6>16:30hrs</h6>
                  <div>
                    <img
                      src={`https://lh3.googleusercontent.com/d/1L4y6YuAZuIYWEOlWr0sBKmoutcMFyG54=s220`}
                      width={40}
                      height={40}
                      alt="Visitante"
                    />
                    <p>{p.equipo2.nombre}</p>
                  </div>
                </div>
                {/*<p>{p.lugar}</p>*/}
                <a className="loginLink" href="#info-torneo" onClick={() => cambiarComponente("E")}>Ver mas ➡️</a>
              </div>
            </div>
          );
        })}
      </div>
      <UsuarioCarrusel />
      <UsuarioTabla1 />
      <UsuarioDestac />
      <UsuarioTabla2 jugadores={jugadoresPrueba} />
    </div>
  );
}
