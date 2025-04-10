import React, { useEffect, useState, useContext } from "react";
import { FilterList } from "@mui/icons-material";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const api_url = import.meta.env.VITE_API_URL;

export default function DuenoHistorial() {
  const { getUserId, getToken } = useContext(AuthContext);
  const [pagos, setPagos] = useState([]);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("");

  const fetchHistorialPagos = async () => {
    try {
      const userId = getUserId();
      const resEquipos = await axios.get(`${api_url}/api/equipos/porDueno/${userId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const todosPagos = [];

      for (const equipo of resEquipos.data) {
        const resPagos = await axios.get(`${api_url}/api/pagos/equipo/${equipo.id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });

        const pagosCompletados = resPagos.data.filter((p) => p.estatusPago === true);
        todosPagos.push(...pagosCompletados);
      }

      setPagos(todosPagos);
    } catch (e) {
      console.error("Error al cargar historial de pagos:", e);
    }
  };

  const verDetallePago = (pago) => {
    setPagoSeleccionado(pago);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setPagoSeleccionado(null);
  };

  useEffect(() => {
    fetchHistorialPagos();
  }, []);

  const pagosFiltrados = pagos.filter(
    (pago) => !filtroTipo || pago.tipoPago.toLowerCase() === filtroTipo.toLowerCase()
  );

  return (
    <div>
      <div className="d-flex flex-row align-items-center justify-content-left g-2 mb-4 container-fluid">
        <h2 className="mb-0">Historial de pagos</h2>
      </div>

      <div className="d-flex flex-row container-fluid align-items-center justify-content-start gap-2">
        <FilterList fontSize="large" />
        <h5 className="mb-0">Filtrar por</h5>
        <select name="tipo" id="" onChange={(e) => setFiltroTipo(e.target.value)}>
          <option value="">Todos los tipos</option>
          <option value="cancha">Cancha</option>
          <option value="arbitraje">Arbitraje</option>
          <option value="inscripcion">Inscripción</option>
        </select>
      </div>

      <br />
      <div className="container-fluid">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-center my-3">
          <div className="w-75 bg-light rounded p-3">
            {pagosFiltrados.map((pago) => (
              <div key={pago.id}>
                <p className="px-2 py-1 align-content-center d-flex mb-0">Pago #{pago.id}</p>
                <hr className="bg-dark mx-1 my-1" />

                <div className="row py-2 justify-content-center align-items-center">
                  <div className="col-lg-10 col-md-9">
                    <div className="row align-items-center">
                      <div className="col-12 col-md-8 text-center text-md-left">
                        <h4>{pago.equipo.nombreEquipo}</h4>
                        <h5>{pago.tipoPago}</h5>
                        <p>{pago.descripcion}</p>
                        <small>Fecha límite: {pago.fechaLimitePago}</small>
                      </div>
                      <div className="col-12 col-md-4 d-flex justify-content-center">
                        <button
                          className="slide-btn-sm text-black"
                          onClick={() => verDetallePago(pago)}
                        >
                          Ver
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="bg-success mx-1 my-1" />
              </div>
            ))}

            {pagosFiltrados.length === 0 && (
              <div className="text-center text-muted py-4">No hay pagos realizados que coincidan con el filtro.</div>
            )}
          </div>
        </div>
      </div>

      {mostrarModal && pagoSeleccionado && (
        <>
          <div
            style={{
              position: "fixed",
              zIndex: 1050,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white",
              borderRadius: "8px",
              padding: "20px",
              width: "90%",
              maxWidth: "500px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            }}
          >
            <h5>Detalle del Pago</h5>
            <hr />
            <p><strong>Equipo:</strong> {pagoSeleccionado.equipo.nombreEquipo}</p>
            <p><strong>Tipo de pago:</strong> {pagoSeleccionado.tipoPago}</p>
            <p><strong>Descripción:</strong> {pagoSeleccionado.descripcion}</p>
            <p><strong>Monto:</strong> ${pagoSeleccionado.monto}</p>
            <p><strong>Fecha límite:</strong> {pagoSeleccionado.fechaLimitePago}</p>
            <p><strong>Fecha de pago:</strong> {pagoSeleccionado.fechaPago || 'No disponible'}</p>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "15px" }}>
              <button className="btn btn-secondary" onClick={cerrarModal}>
                Cerrar
              </button>
            </div>
          </div>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.5)",
              zIndex: 1040,
            }}
            onClick={cerrarModal}
          ></div>
        </>
      )}
    </div>
  );
}
