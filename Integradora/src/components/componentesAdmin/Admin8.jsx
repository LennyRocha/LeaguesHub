import React, { useState } from "react";
import "bootstrap";

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
    jugadores: jugadoresPrueba,
    img: "https://drive.google.com/uc?export=view&id=1HMF63odQw9WzQdVmfFbSP1H3_F8qY-uV",
  },
];

export default function Admin8({ cambiarComponent }) {
  const [visible, setVisible] = useState(false);
  const [equipo, setEquipo] = useState([]);
  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <a onClick={() => cambiarComponent("home")} className="link">
              Inicio
            </a>
          </li>
          <li class="breadcrumb-item">
            <a onClick={() => cambiarComponent("equipos")} className="link">
              Dueños
            </a>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            Equipos
          </li>
        </ol>
      </nav>
      <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0">Equipos de Fulanito</h2>
        </div>
        <div className="overf-auto">
          {equipos.map((e) => {
            return (
              <div className="dueno-container-2 bg-light" key={e.equipoId}>
                <img src={e.img} alt={e.nombre} className="teamImage" />
                <h5 className="w-100">{e.nombre}</h5>
                <button className="slide-btn-sm" onClick={() => setVisible(!visible)}>Ver jugadores</button>
              </div>
            );
          })}
        </div>
        <div className={`${ visible ? 'teamsVisible' : 'teamsInvisible'}`}>
          <div className="d-sm-flex align-items-center justify-content-between mt-4 mb-2 ml-2">
            <h3 className="mb-0">Equipo x</h3>
          </div>
          <div className="players-grid">
            {jugadoresPrueba.map((j) => {
              return (
                <div className="over-card" key={j.id}>
                  <div className="kard">
                    <div className="face card-front">
                      <div
                        className={`front-head ${
                          j.activo ? "aktive" : "inactive"
                        }`}
                      >
                        <img src={j.img} alt={j.nombre} className="jugImg" />
                      </div>
                      <h5 className="h_tz f-col">{j.nombre}</h5>
                      <div
                        className={`mini-alert ${
                          j.activo ? "aktive activeTxt" : "inactive inactiveTxt"
                        }`}
                      >
                        {j.activo ? "Activo" : "Inactivo"}
                      </div>
                    </div>
                    <div className="face card-back _col">
                      <h3>Info</h3>
                      <div className="mini-grid">
                        <div className="para_alla">
                          <p>Partidos</p>
                          <p>Goles</p>
                          <p>t. rojas</p>
                          <p>t. amarillas</p>
                        </div>
                        <div className="para_aca">
                          <p>10</p>
                          <p>1</p>
                          <p>N/A</p>
                          <p>3</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
