import React from "react";
import "bootstrap";
import "../../css/usuario.css";

const jugadores = [
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

export default function UsuarioTabla2() {
  return (
    <div className="my-5">
      <h1 id="goleo">Tablas de Goleo</h1>
      <div className="over-auto">
        <table className="table">
          <thead className="myThead">
            <tr>
            <th>POS</th>
            <th>EQUIPO</th>
            <th>FOTO</th>
            <th className="jugadorCell jugadorTh">JUGADOR</th>
            <th>PARTIDOS</th>
            <th>GOLES</th>
            <th>PTS</th>
            <th>MJ</th>
            </tr>
          </thead>
          <tbody>
            {jugadores.map((j, index) => {
              return (
                <tr key={j.id}>
                  <td>{j.id}</td>
                  <td className="imgCell">
                    <img
                      src="https://th.bing.com/th/id/OIP.EsWex0S9Lwksykh1kD00XQHaI3?rs=1&pid=ImgDetMain"
                      alt="Chivas"
                      width={30}
                      height={30}
                      className="img-back-no"
                    />
                  </td>
                  <td className="imgCell">
                    <img
                      src={j.img}
                      alt={j.nombre}
                      width={30}
                      height={30}
                    />
                  </td>
                  <td className="jugadorTh">{j.nombre}</td>
                  <td className="diff">{j.partidos}</td>
                  <td className="goles">{j.goles}</td>
                  <td className="pts">+{j.goles * 3}</td>
                  <td className="mj">{j. partidos * 90}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
