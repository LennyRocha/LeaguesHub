import React, { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import MiniLoadingScreen from "../MiniLoadingScreen";
import axios from "axios";
import "../../css/usuario.css";
import "bootstrap";

export default function UsuarioLista({ cambiarComponente, getUrl, api }) {
  const [torneos, setTorneos] = useState([]);
  const [partidos, setPartidos] = useState({});
  const [loadData, setLoadData] = useState(true);
  const [partidosCargados, setPartidosCargados] = useState(false);

  async function getPartidos(id) {
    try {
      const res = await axios.get(
        `${api}/api/partidos/todos/portorneo/${id}`
      );

      if (res.data.length === 0) {
        console.log("No hay partidos registrados todavía");
        return;
      }

      setPartidos((prevPartidos) => ({
        ...prevPartidos,
        [id]: res.data,
      }));

      console.log(res.data, "K");
    } catch (e) {
      console.error(e, e.response?.message);
    }
  }

  useEffect(() => {
    const getTorneos = async () => {
      try {
        const res = await axios.get(`${api}/api/torneos`);

        if (res.data.length === 0) {
          console.log("No hay torneos registrados todavía");
        } else {
          setTorneos(res.data);
          console.log(res.data, "Torneos");
          await llenarLista(res.data);
        }
      } catch (e) {
        console.error(e, e.response?.message);
      }
    };

    getTorneos();
  }, []);

  async function llenarLista(lista) {
    await Promise.all(lista.map((t) => getPartidos(t.id)));

    console.log("Lista completa con partidos:", partidos);

    setPartidosCargados(true);
    setLoadData(false);
  }

  return (
    <div className="partidoRow" id="partidos">
      {loadData ? (
        <MiniLoadingScreen />
      ) : (
        torneos.map((p) => {
          if (!partidos[p.id] || partidos[p.id].length === 0) {
            return null; 
          }

          return (
            <div className="partidoCard" key={p.id}>
              <div className="partidoCardHeader">
                <img
                  src={getUrl(p.logoTorneo)}
                  alt={p.nombreTorneo}
                  width={40}
                  height={40}
                />
                <h5>{p.nombreTorneo}</h5>
              </div>
              <div className="partidoCardBody">
                <div className="partidoDataRow">
                  <b>{partidos[p.id][0].fechaPartido}</b>
                </div>
                <div className="partidoDataRow">
                  <div>
                    <img
                      src={getUrl(partidos[p.id][0].equipoLocal.logo)}
                      alt="Local"
                      width={40}
                      height={40}
                    />
                    <p>{partidos[p.id][0].equipoLocal.nombreEquipo}</p>
                  </div>
                  <h6>{partidos[p.id][0].hora}</h6>
                  <div>
                    <img
                      src={getUrl(partidos[p.id][0].equipoVisitante.logo)}
                      alt="Visitante"
                      width={40}
                      height={40}
                    />
                    <p>{partidos[p.id][0].equipoVisitante.nombreEquipo}</p>
                  </div>
                </div>
                <a className="loginLink" href="#info-torneo" onClick={() => cambiarComponente("E")}>Ver más partidos ➡️</a>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}