import React from "react";
import { useState } from "react";
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
import { Edit } from "@mui/icons-material";
import "../../css/sb-admin-2.css";

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

export default function DuenoJugadores({ cambiarComponente }) {
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [edit, setEdit] = useState(false);
  const [preview, setPreview] = useState(
    "https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
  );

  const [load, setLoad] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="w-100">
      <div className="d-sm-flex align-items-center justify-content-left g-2 mb-4 container-fluid">
        <h2 className="mb-0">Menú de jugadores</h2>
        <IconButton
          onClick={() => {
            setEdit(false);
            setVisible2(!visible2);
          }}
        >
          <Edit color="primary" />
        </IconButton>
      </div>
      <div class="row g-5">
        <div class="col-md-8">
          <div className={`${visible ? "teamsVisible" : "teamsInvisible"}`}>
            <article class="blog-post container-fluid w-100">
              <div className="players-grid-d player-flow quitarScroll">
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
                            <img
                              src={j.img}
                              alt={j.nombre}
                              className="jugImg"
                            />
                          </div>
                          <h5 className="h_tz f-col">{j.nombre}</h5>
                          <div
                            className={`mini-alert ${
                              j.activo
                                ? "aktive activeTxt"
                                : "inactive inactiveTxt"
                            }`}
                          >
                            {j.activo ? "Activo" : "Inactivo"}
                          </div>
                        </div>
                        <div className="face card-back _col">
                          <h4 className="text-center mt-2 mb-0">Datos</h4>
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
                          <a
                            className="link"
                            onClick={() => {
                              setEdit(true);
                              setVisible2(true);
                            }}
                          >
                            Editar
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>
        </div>

        <div class="col-md-4 position-sticky">
          <div class="position-sticky">
            <div class="p-4 mb-3 bg-light rounded">
              <details>
                <summary>Elige un equipo para ver sus jugadores</summary>
                {equipos.map((e) => (
                  <li>
                    <a className="link" onClick={() => setVisible(!visible)}>
                      {e.nombre}
                    </a>
                  </li>
                ))}
              </details>
            </div>

            <div className={`p-sm-1 ${visible2 ? "teamsVisible" : "teamsInvisible"}`}>
              <h4 class="d-flex justify-content-between align-items-center mb-3">
                <span class="body-small">
                  {edit ? "Editar jugador" : "Registrar jugador"}
                </span>
              </h4>
              <div className="arbitro-card bg-light rounded mb-4">
                <form>
                  <div className="player-picture">
                    <div className="fotoPlayer">
                      <img
                        src={preview}
                        alt="Foto de perfil nueva"
                        id="selPictPlayer"
                      />
                      <Tooltip title="Elegir una imagen">
                        <div className="botonDivPlayer">
                          <input
                            type="file"
                            className="botonCamPlayer"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                          <i className="fa fa-camera"></i>
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                  <TextField
                    className="txtAr txtCon"
                    label="Nombre completo"
                    fullWidth
                    margin="dense"
                    name="nombre"
                    required
                    id="arbName"
                  />
                  <p className="text-danger"></p>
                  <TextField
                    className="txtAr txtCon"
                    type="date"
                    placeholder="Fecha de nacimiento"
                    fullWidth
                    margin="dense"
                    name="correo"
                    required
                  />
                  <p className="text-danger"></p>
                  <TextField
                    className="txtAr txtCon"
                    type="number"
                    label="Número de camiseta"
                    fullWidth
                    margin="dense"
                    name="contra"
                    required
                  />
                  <p className="text-danger"></p>
                  {load ? (
                    <div className="my-spinner"></div>
                  ) : (
                    <button
                      type="submit"
                      id="submitArb"
                      className={"text-black"}
                    >
                      Registrar
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
