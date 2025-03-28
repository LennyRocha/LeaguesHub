import React, { useEffect, useState } from "react";
import "bootstrap";
import "../../css/usuario.css";
import axios from "axios";
import MiniLoadingScreen from "../MiniLoadingScreen";

export default function UsuarioTabla2() {
  const [torneos, setTorneos] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [torneoSeleccionado, setTorneoSeleccionado] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginaActual, setPaginaActual] = useState(0);
  const porPagina = 10;

  const api = import.meta.env.VITE_API_URL;

  const transformarUrl = (url) => {
    const match = url.match(/id=([^&]+)/);
    return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
  };

  const fetchTorneos = async () => {
    try {
      const res = await axios.get(`${api}/api/torneos/iniciados`);
      setTorneos(res.data);
      if (res.data.length > 0) {
        setTorneoSeleccionado(res.data[0].id); // Selecciona el primero por defecto
      }
    } catch (e) {
      setError("Error al cargar los torneos.");
    }
  };

  const fetchGoleadores = async (idTorneo) => {
    setLoading(true);
    try {
      const res = await axios.get(`${api}/api/jugadorestadisticas/torneo/${idTorneo}`);
      setJugadores(res.data);
    } catch (e) {
      setError("Error al cargar la tabla de goleo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTorneos();
  }, []);

  useEffect(() => {
    if (torneoSeleccionado) {
      fetchGoleadores(torneoSeleccionado);
    }
  }, [torneoSeleccionado]);

  const start = paginaActual * porPagina;
  const end = start + porPagina;
  const jugadoresPaginados = jugadores.slice(start, end);

  return (
    <div className="my-5">
      <h1 id="goleo">Tablas de Goleo</h1>

      <div className="partidoFilter">
        <select
          value={torneoSeleccionado}
          onChange={(e) => {
            setTorneoSeleccionado(e.target.value);
            setPaginaActual(0);
          }}
        >
          {torneos.map((torneo) => (
            <option key={torneo.id} value={torneo.id}>
              {torneo.nombreTorneo}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-danger">{error}</p>}
      {loading ? (
        <MiniLoadingScreen />
      ) : (
        <>
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
                </tr>
              </thead>
              <tbody>
                {jugadoresPaginados.map((j, index) => (
                  <tr key={j.id}>
                    <td>{start + index + 1}</td>
                    <td className="imgCell">
                      <img
                        src={transformarUrl(j.logoEquipo)}
                        alt="equipo"
                        width={30}
                        height={30}
                        className="img-back-no"
                      />
                    </td>
                    <td className="imgCell">
                      <img
                        src={transformarUrl(j.fotoJugador)}
                        alt={j.nombreCompleto}
                        width={30}
                        height={30}
                      />
                    </td>
                    <td className="jugadorTh">{j.nombreCompleto}</td>
                    <td className="diff">{j.partidosJugados}</td>
                    <td className="goles">{j.goles}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {jugadores.length > porPagina && (
            <div className="pagination-container">
              <button
                disabled={paginaActual === 0}
                onClick={() => setPaginaActual(paginaActual - 1)}
              >
                Anterior
              </button>
              <span>
                Página {paginaActual + 1} de {Math.ceil(jugadores.length / porPagina)}
              </span>
              <button
                disabled={end >= jugadores.length}
                onClick={() => setPaginaActual(paginaActual + 1)}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}