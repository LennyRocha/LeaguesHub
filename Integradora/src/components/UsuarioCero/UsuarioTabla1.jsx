import React, { useEffect, useState } from "react";
import MiniLoadingScreen from "../MiniLoadingScreen";
import "bootstrap";
import "../../css/usuario.css";
import axios from "axios";

export default function UsuarioTabla1({ api }) {
  const [torneos, setTorneos] = useState([]);
  const [partidos, setPartidos] = useState({});
  const [equipos, setEquipos] = useState([]);
  const [selectedTorneo, setSelectedTorneo] = useState("");
  const [loading, setLoading] = useState(true);
  const [partidosCargados, setPartidosCargados] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    setLoading(true);
    const fetchTorneos = async () => {
      try {
        const res = await axios.get(`${api}/api/torneos/iniciados`);
        setTorneos(res.data);
        console.log(res.data,'X')
        if (res.data.length > 0) {
          setSelectedTorneo(res.data[0].id);
        }
      } catch (e) {
        setError("Error al cargar los torneos. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    fetchTorneos();
  }, []);

  useEffect(() => {
    if (selectedTorneo) {
      setLoading(true);
      const fetchEquipos = async () => {
        try {
          const res = await axios.get(`${api}/api/tabla-clasificacion/${selectedTorneo}`);
          setEquipos(res.data);
        } catch (e) {
          setError("Error al cargar la tabla de clasificación.");
        } finally {
          setLoading(false);
        }
      };
      fetchEquipos();
    }
  }, [selectedTorneo]);

  useEffect(() => {
    if (selectedTorneo) {
      const fetchPartidos = async () => {
        try {
          const res = await axios.get(`${api}/api/partidos/todos/portorneo/${selectedTorneo}`);
          setPartidos((prev) => ({ ...prev, [selectedTorneo]: res.data }));
        } catch (e) {
          console.error("Error al cargar los partidos:", e);
        }
      };
      fetchPartidos();
    }
  }, [selectedTorneo]);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedTeams = equipos.slice(startIndex, endIndex);
  const transformarUrl = (url) => {
    const match = url.match(/id=([^&]+)/);
    return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
  };
  

  return (
    <div className="my-5">
      <h1 id="clasif">Tablas de Clasificación</h1>
      <div className="partidoFilter">
        <select value={selectedTorneo} onChange={(e) => { setSelectedTorneo(e.target.value); setCurrentPage(0); }}>
          <option value="">Selecciona un torneo</option>
          {torneos.map((torneo) => (
            <option key={torneo.id} value={torneo.id}>{torneo.nombreTorneo}</option>
          ))}
        </select>
      </div>
      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <MiniLoadingScreen />
      ) : (
        <div className="over-auto">
          <table className="table">
            <thead className="myThead">
              <tr>
                <th>POS</th>
                <th></th>
                <th>EQUIPO</th>
                <th>JJ</th>
                <th>JG</th>
                <th>JE</th>
                <th>JP</th>
                <th>GF</th>
                <th>GC</th>
                <th>DIFF</th>
                <th>PTS</th>
              </tr>
            </thead>
            <tbody>
              {displayedTeams.map((team, index) => (
                <tr key={team.id}>
                  <td>{startIndex + index + 1}</td>
                  <td className="imgCell"><img src={transformarUrl(team.logo)} alt={team.nombreEquipo} width={30} height={30} /></td>
                  <td>{team.nombreEquipo}</td>
                  <td>{team.partidosGanados + team.partidosEmpatados + team.partidosPerdidos}</td>
                  <td className="jg">{team.partidosGanados}</td>
                  <td className="je">{team.partidosEmpatados}</td>
                  <td className="jp">{team.partidosPerdidos}</td>
                  <td>{team.golesAFavor}</td>
                  <td>{team.golesEnContra}</td>
                  <td className="diff">{team.golesAFavor - team.golesEnContra}</td>
                  <td className="pts">{team.puntos}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-container">
            <button disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)}>Anterior</button>
            <span>Página {currentPage + 1} de {Math.ceil(equipos.length / itemsPerPage)}</span>
            <button disabled={endIndex >= equipos.length} onClick={() => setCurrentPage(currentPage + 1)}>Siguiente</button>
          </div>
        </div>
      )}
    </div>
  );
}