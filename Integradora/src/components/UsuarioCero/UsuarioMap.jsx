import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UsuarioMap({ torneoId, getUrl, api, volver }) {
  const [partidos, setPartidos] = useState([]);
  const [filtro, setFiltro] = useState("TODOS");
  const [pagina, setPagina] = useState(1);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [partidoSeleccionado, setPartidoSeleccionado] = useState(null);

  const porPagina = 5;

  useEffect(() => {
    const obtenerPartidos = async () => {
      try {
        const res = await axios.get(`${api}/api/partidos/todos/portorneo/${torneoId}`);
        setPartidos(res.data);
      } catch (error) {
        console.error("Error al obtener partidos:", error);
      }
    };
    obtenerPartidos();
  }, [torneoId]);

  const filtrarPartidos = () => {
    if (filtro === "PENDIENTES") return partidos.filter(p => !p.jugado);
    if (filtro === "JUGADOS") return partidos.filter(p => p.jugado);
    return partidos;
  };

  const partidosFiltrados = filtrarPartidos();
  const totalPaginas = Math.ceil(partidosFiltrados.length / porPagina);
  const partidosPagina = partidosFiltrados.slice((pagina - 1) * porPagina, pagina * porPagina);

  const cambiarPagina = (nueva) => {
    if (nueva > 0 && nueva <= totalPaginas) {
      setPagina(nueva);
    }
  };

  const abrirModal = (partido) => {
    setPartidoSeleccionado(partido);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPartidoSeleccionado(null);
  };

  return (
    <div className="contenedor-arbitro">
      <button onClick={volver} style={{ marginBottom: "1rem" }} className="btn btn-dark">← VOLVER</button>

      <div className="filtros">
        <button onClick={() => { setFiltro("TODOS"); setPagina(1); }} className={`filtro-btn ${filtro === "TODOS" ? "activo" : ""}`}>TODOS</button>
        <button onClick={() => { setFiltro("PENDIENTES"); setPagina(1); }} className={`filtro-btn ${filtro === "PENDIENTES" ? "activo" : ""}`}>PENDIENTES</button>
        <button onClick={() => { setFiltro("JUGADOS"); setPagina(1); }} className={`filtro-btn ${filtro === "JUGADOS" ? "activo" : ""}`}>JUGADOS</button>
      </div>

      <h3 style={{ textAlign: "center", margin: "1rem 0" }}>Torneo Sub-17 En Espera</h3>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
        {partidosPagina.length > 0 ? (
          partidosPagina.map((p) => (
            <div key={p.id} style={{ width: "220px", background: "#fff", padding: "1rem", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", textAlign: "center" }}>
              <div>
                <img src={getUrl(p.equipoLocal.logo)} alt="local" style={{ width: 40, height: 40 }} />
                <div style={{ fontWeight: "bold", margin: "5px 0" }}>
                  {p.jugado ? `${p.golesLocal} - ${p.golesVisitante}` : "vs"}
                </div>
                <img src={getUrl(p.equipoVisitante.logo)} alt="visitante" style={{ width: 40, height: 40 }} />
              </div>
              <p style={{ fontWeight: "bold" }}>{p.equipoLocal.nombreEquipo} vs {p.equipoVisitante.nombreEquipo}</p>
              <p>📅 {p.fechaPartido} 🕒 {p.hora}</p>
              <p style={{ fontWeight: "bold", color: "#666" }}>{p.tipoPartido === "JORNADA REGULAR" ? "Jornada Regular" : p.tipoPartido}</p>
              <button onClick={() => abrirModal(p)} className="btn btn-danger">DETALLES</button>
            </div>
          ))
        ) : (
          <p>No hay partidos para este filtro aún.</p>
        )}
      </div>

      {totalPaginas > 1 && (
        <div className="paginacion" style={{ marginTop: "1rem", textAlign: "center" }}>
          <button onClick={() => cambiarPagina(pagina - 1)} className="btn btn-secondary">ANTERIOR</button>
          <span style={{ margin: "0 1rem" }}>{pagina} / {totalPaginas}</span>
          <button onClick={() => cambiarPagina(pagina + 1)} className="btn btn-secondary">SIGUIENTE</button>
        </div>
      )}

      {modalAbierto && partidoSeleccionado && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
          <div style={{ background: "white", padding: 20, borderRadius: 10, width: "90%", maxWidth: 600 }}>
            <h4 style={{ textAlign: "center" }}>{partidoSeleccionado.torneo?.nombreTorneo}</h4>
            <h5 style={{ textAlign: "center" }}>{partidoSeleccionado.equipoLocal.nombreEquipo} vs {partidoSeleccionado.equipoVisitante.nombreEquipo}</h5>
            <p style={{ textAlign: "center" }}>📅 {partidoSeleccionado.fechaPartido} 🕒 {partidoSeleccionado.hora}</p>
            <p><strong>Campo:</strong> {partidoSeleccionado.cancha.campo.nombre}</p>
            <p><strong>Dirección:</strong> {partidoSeleccionado.cancha.campo.direccion}</p>
            <iframe
              src={`https://www.google.com/maps?q=${partidoSeleccionado.cancha.campo.latitud},${partidoSeleccionado.cancha.campo.longitud}&z=17&output=embed`}
              width="100%"
              height="300"
              allowFullScreen=""
              loading="lazy"
              title="Ubicación del campo"
              style={{ margin: "1rem 0" }}
            ></iframe>
            {partidoSeleccionado.jugado && (
              <>
                <p><strong>Goles Local:</strong> {partidoSeleccionado.golesLocal}</p>
                <p><strong>Goles Visitante:</strong> {partidoSeleccionado.golesVisitante}</p>
                {partidoSeleccionado.tipoDesempate && (
                  <p><strong>Desempate:</strong> {partidoSeleccionado.tipoDesempate}</p>
                )}
                {partidoSeleccionado.tipoDesempate === "PENALES" && (
                  <>
                    <p><strong>Penales Local:</strong> {partidoSeleccionado.golesLocalPenales}</p>
                    <p><strong>Penales Visitante:</strong> {partidoSeleccionado.golesVisitantePenales}</p>
                  </>
                )}
              </>
            )}
            <button onClick={cerrarModal} className="btn btn-dark" style={{ marginTop: 10, display: "block", width: "100%" }}>CERRAR</button>
          </div>
        </div>
      )}

      <style>{`
        .filtro-btn {
          background: white;
          border: none;
          padding: 6px 12px;
          margin: 4px;
          font-weight: bold;
          color: #444;
          border-radius: 4px;
          cursor: pointer;
        }
        .filtro-btn.activo {
          background: #D7263D;
          color: white;
        }
      `}</style>
    </div>
  );
}