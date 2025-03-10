import React from "react";
import "bootstrap";
import "../../css/usuario.css";

export default function UsuarioTabla2({jugadores}) {
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
