import React, { useEffect, useState } from "react";
import MiniLoadingScreen from "../MiniLoadingScreen";
import axios from "axios";
import "../../css/usuario.css";
import "bootstrap";

export default function UsuarioLista({ cambiarComponente, getUrl, api }) {
  const [torneos, setTorneos] = useState([]);
  const [partidos, setPartidos] = useState({});
  const [loadData, setLoadData] = useState(true);

  const getPartidos = async (id) => {
    try {
      const res = await axios.get(`${api}/api/partidos/todos/portorneo/${id}`);
      const primerNoJugado = res.data.find((p) => !p.jugado);
      setPartidos((prev) => ({
        ...prev,
        [id]: primerNoJugado ? [primerNoJugado] : [],
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const getTorneos = async () => {
    try {
      const res = await axios.get(`${api}/api/torneos`);
      setTorneos(res.data);
      await Promise.all(res.data.map((t) => getPartidos(t.id)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadData(false);
    }
  };

  useEffect(() => {
    getTorneos();
  }, []);

  return (
    <div className="partidoRow" id="partidos">
      {loadData ? (
        <MiniLoadingScreen />
      ) : (
        torneos.map((p) => {
          const partido = partidos[p.id]?.[0];
          if (!partido) return null;

          return (
            <div className="partidoCard" key={p.id}>
              <div className="partidoCardHeader">
                <img
                  src={getUrl(p.logoTorneo)}
                  alt="logo torneo"
                  width={30}
                  height={30}
                />
                <h5>{p.nombreTorneo}</h5>
              </div>
              <div className="partidoCardBody">
                <div className="partidoDataRow">
                  <b>{partido.fechaPartido}</b>
                </div>
                <div className="partidoDataRow">
                  <div>
                    <img
                      src={getUrl(partido.equipoLocal.logo)}
                      alt="local"
                      width={30}
                      height={30}
                    />
                    <p>{partido.equipoLocal.nombreEquipo}</p>
                  </div>
                  <h6>{partido.hora}</h6>
                  <div>
                    <img
                      src={getUrl(partido.equipoVisitante.logo)}
                      alt="visitante"
                      width={30}
                      height={30}
                    />
                    <p>{partido.equipoVisitante.nombreEquipo}</p>
                  </div>
                </div>
                <a
                  className="loginLink"
                  href="#info-torneo"
                  onClick={() => cambiarComponente("MAP", p.id)}
                >
                  Ver más partidos ➡️
                </a>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}