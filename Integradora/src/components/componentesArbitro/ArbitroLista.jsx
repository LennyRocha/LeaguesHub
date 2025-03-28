import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import "./ArbitroLista.css";

export default function ArbitroLista({ cambiarComponente, setPartidoSeleccionado }) {
  const { getUserId, getToken, api_url } = useContext(AuthContext);
  const [filtro, setFiltro] = useState("pendientes");
  const [partidos, setPartidos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [partidoDetalle, setPartidoDetalle] = useState(null);
  const partidosPorPagina = 5;

  const transformarUrl = (url) => {
    const match = url.match(/id=([^&]+)/);
    return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
  };

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const obtenerEndpoint = () => {
    const idUsuario = getUserId();
    if (filtro === "pendientes") return `${api_url}/api/partidos/arbitro/pendientes/${idUsuario}`;
    if (filtro === "listos") return `${api_url}/api/partidos/arbitro/listos/${idUsuario}`;
    return `${api_url}/api/partidos/arbitro/asignados/${idUsuario}`;
  };

  const fetchPartidos = async () => {
    try {
      const res = await axios.get(obtenerEndpoint(), {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setPartidos(res.data);
    } catch (err) {
      console.error("Error al obtener partidos:", err);
    }
  };

  useEffect(() => {
    fetchPartidos();
    setPaginaActual(1);
  }, [filtro]);

  const abrirDetalles = (partido) => {
    setPartidoDetalle(partido);
    setModalVisible(true);
  };

  const renderTipoPartido = (p) => {
    if (p.tipoPartido === "JORNADA REGULAR") return "Jornada Regular";
    if (p.tipoPartido === "LIGUILLA") {
      if (p.idaVuelta === "IDA") return "Liguilla IDA";
      if (p.idaVuelta === "VUELTA") {
        if(p.jugado){
          if (p.tipoDesempate === "PENALES") {
            return `FINAL VUELTA - PENALES (${p.golesLocalPenales}-${p.golesVisitantePenales})`;
          } else {
            return `LIGUILLA VUELTA - ${p.tipoDesempate}`;
          }
        }else{
          return `LIGUILLA VUELTA`;
        }
        
      }
    }
    return "";
  };

  const partidosPaginados = partidos.slice(
    (paginaActual - 1) * partidosPorPagina,
    paginaActual * partidosPorPagina
  );

  const totalPaginas = Math.ceil(partidos.length / partidosPorPagina);
  const cambiarPagina = (dir) => {
    setPaginaActual((prev) => Math.max(1, Math.min(prev + dir, totalPaginas)));
  };

  return (
    <div className="contenedor-arbitro">
      <h2>Lista de partidos</h2>

      <div className="filtros">
        <button className={filtro === "pendientes" ? "activo" : ""} onClick={() => setFiltro("pendientes")}>PENDIENTES</button>
        <button className={filtro === "listos" ? "activo" : ""} onClick={() => setFiltro("listos")}>LISTOS</button>
        <button className={filtro === "todos" ? "activo" : ""} onClick={() => setFiltro("todos")}>TODOS</button>
      </div>

      {partidos.length === 0 ? (
        <p><strong>No hay partidos para mostrar en este filtro.</strong></p>
      ) : (
        <>
          <div className="grid-partidos">
            {partidosPaginados.map((p) => (
              <div key={p.id} className="card-partido">
                <div className="logos">
                  <img src={transformarUrl(p.equipoLocal.logo)} alt="local" />
                  {p.jugado && <span>{p.golesLocal}</span>}
                  <span> - </span>
                  {p.jugado && <span>{p.golesVisitante}</span>}
                  <img src={transformarUrl(p.equipoVisitante.logo)} alt="visitante" />
                </div>
                <div className="nombres">
                  <strong>{p.equipoLocal.nombreEquipo}</strong> vs <strong>{p.equipoVisitante.nombreEquipo}</strong>
                </div>
                <div className="tipo">{renderTipoPartido(p)}</div>
                <div className="fecha">{formatearFecha(p.fechaPartido)}</div>
                {filtro !== "listos" && (
                  <div className="campo">{p.cancha.campo.nombre}, {p.cancha.descripcion}</div>
                )}
                <div className="botones">
                  <button onClick={() => abrirDetalles(p)}>DETALLES</button>
                  {!p.jugado && (
                    <button onClick={() => {
                      setPartidoSeleccionado(p);
                      cambiarComponente("B");
                    }}>REGISTRAR</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* paginación */}
          {totalPaginas > 1 && (
            <div className="paginacion">
              <button disabled={paginaActual === 1} onClick={() => cambiarPagina(-1)}>←</button>
              <span>{paginaActual} / {totalPaginas}</span>
              <button disabled={paginaActual === totalPaginas} onClick={() => cambiarPagina(1)}>→</button>
            </div>
          )}
        </>
      )}

      {/* Modal de detalles */}
      {modalVisible && partidoDetalle && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Detalles del partido</h3>

            <div>
              <img src={transformarUrl(partidoDetalle.torneo.logoTorneo)} alt="logo torneo" />
              <p><strong>Torneo:</strong> {partidoDetalle.torneo.nombreTorneo}</p>
            </div>

            <div>
              <p><strong>Equipos:</strong></p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
                <img src={transformarUrl(partidoDetalle.equipoLocal.logo)} alt="local" />
                <span>{partidoDetalle.equipoLocal.nombreEquipo}</span>
                {partidoDetalle.jugado && <span>({partidoDetalle.golesLocal})</span>}
                <span>-</span>
                {partidoDetalle.jugado && <span>({partidoDetalle.golesVisitante})</span>}
                <span>{partidoDetalle.equipoVisitante.nombreEquipo}</span>
                <img src={transformarUrl(partidoDetalle.equipoVisitante.logo)} alt="visitante" />
              </div>
            </div>

            <p><strong>Fecha:</strong> {formatearFecha(partidoDetalle.fechaPartido)}</p>
            <p><strong>Hora:</strong> {partidoDetalle.hora}</p>
            <p><strong>Campo:</strong> {partidoDetalle.cancha.campo.nombre}</p>
            <p><strong>Dirección:</strong> {partidoDetalle.cancha.campo.direccion}</p>

            <iframe
              src={`https://www.google.com/maps?q=${partidoDetalle.cancha.campo.latitud},${partidoDetalle.cancha.campo.longitud}&z=17&output=embed`}
              width="100%"
              height="300"
              allowFullScreen=""
              loading="lazy"
              title="Ubicación del campo"
            ></iframe>

            {partidoDetalle.jugado && (
              <>
                <p><strong>Goles Local:</strong> {partidoDetalle.golesLocal}</p>
                <p><strong>Goles Visitante:</strong> {partidoDetalle.golesVisitante}</p>
                {partidoDetalle.tipoDesempate && (
                  <p><strong>Desempate:</strong> {partidoDetalle.tipoDesempate}</p>
                )}
                {partidoDetalle.tipoDesempate === "PENALES" && (
                  <>
                    <p><strong>Penales Local:</strong> {partidoDetalle.golesLocalPenales}</p>
                    <p><strong>Penales Visitante:</strong> {partidoDetalle.golesVisitantePenales}</p>
                  </>
                )}
              </>
            )}

            <button onClick={() => setModalVisible(false)} className="cerrar-modal">CERRAR</button>
          </div>
        </div>
      )}
    </div>
  );
}