import React, { useState, useEffect, useContext } from "react";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const api_url = import.meta.env.VITE_API_URL; // Asegúrate de tener esto definido

export default function DuenoPagos({ cambiarComponente }) {
  const [load, setLoad] = useState(true);
  const [equipo, setEquipo] = useState(null);
  const { getToken, getUserId } = useContext(AuthContext);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [pagos, setPagos] = useState([]);

  const fetchEquipo = async () => {
    try {
      const userId = getUserId();
      const res = await axios.get(`${api_url}/api/equipos/porDueno/${userId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
  
      setEquipo(res.data); // Guarda el arreglo completo
      if (res.data.length > 0) {
        setEquipoSeleccionado(res.data[0]); // Selecciona el primero por defecto
      }
  
    } catch (e) {
      console.error("Error al cargar el equipo:", e);
      setEquipo([]);
      setEquipoSeleccionado(null);
    } finally {
      setLoad(false);
    }
  };
  const fetchPagosPorEquipo = async (idEquipo) => {
    try {
      const res = await axios.get(`${api_url}/api/pagos/equipo/${idEquipo}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setPagos(res.data);
    } catch (error) {
      console.error("Error al cargar los pagos:", error);
      setPagos([]);
    }
  };
  
  
  useEffect(() => {
    fetchEquipo();
  }, []);
  
  useEffect(() => {
    if (equipoSeleccionado) {
      fetchPagosPorEquipo(equipoSeleccionado.id);
    }
  }, [equipoSeleccionado]);

  return (
    <div>
      <div className="d-flex flex-row align-items-center justify-content-left g-2 mb-4 container-fluid">
        <h2 className="mb-0">Menú de pagos</h2>
      </div>
  
      <div className="flex-row gap-5 container-fluid">
        <h5>Pagos por equipo</h5>
        {load ? (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        ) : equipo.length > 0 ? (
          <div className="form-group">
            <label htmlFor="selectorEquipo">Selecciona un equipo:</label>
            <select
              id="selectorEquipo"
              className="form-select mt-1"
              value={equipoSeleccionado?.id || ""}
              onChange={(e) =>
                setEquipoSeleccionado(
                  equipo.find((eq) => eq.id === parseInt(e.target.value))
                )
              }
            >
              {equipo.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.nombreEquipo}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <span className="badge bg-warning mx-1 p-1">No tienes equipos</span>
        )}
      </div>
  
      <div className="row container-fluid my-2">
        <div className="col-md-4 order-md-last">
          <Tooltip title="Solo puedes realizar un pago por equipo">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-danger">Detalles del pago</span>
            </h4>
          </Tooltip>
          <ul className="list-group mb-3">
            <li className="list-group-item d-flex justify-content-between lh-sm">
              <div>
                <h6 className="my-0">Nombre del equipo</h6>
                <small className="text-muted">a realizar el pago</small>
              </div>
              <span className="text-muted">
                {equipoSeleccionado ? equipoSeleccionado.nombreEquipo : "N/A"}
              </span>
            </li>
            <li className="list-group-item d-flex justify-content-between lh-sm">
              <div>
                <h6 className="my-0">Total de pagos</h6>
                <small className="text-muted">pendientes</small>
              </div>
              <span className="text-muted">
                {pagos.filter((p) => !p.estatusPago).length}
              </span>
            </li>
            <li className="list-group-item d-flex justify-content-between lh-sm">
              <div>
                <h6 className="my-0">Fecha de pago</h6>
                <small className="text-muted">a corte de</small>
              </div>
              <span className="text-muted">
                {new Date().toISOString().substring(0, 10)}
              </span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <span>Precio total</span>
              <strong>
                $
                {pagos
                  .filter((p) => !p.estatusPago)
                  .reduce((total, p) => total + p.monto, 0)}
              </strong>
            </li>
          </ul>
  
          <button className="slide-btn text-black">Pagar</button>
        </div>
  
        <div className="col-lg-8 pagos-list quitarScroll">
          <div className="payments-grid">
            {pagos.filter((p) => !p.estatusPago).length === 0 ? (
              <div className="alert alert-info">No hay pagos pendientes.</div>
            ) : (
              pagos
                .filter((pago) => !pago.estatusPago)
                .map((pago) => (
                  <div
                    key={pago.id}
                    className="card border-left-danger shadow h-100 p-0 mb-3"
                  >
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-1">
                          <div className="text-xs font-weight-bold text-danger text-uppercase mb-2 card-text">
                            Descripción:{" "}
                            <span className="text-black">{pago.descripcion}</span>
                          </div>
                          <div className="card-grid no-gutters align-items-center">
                            <h6 className="mb-0 mr-3">
                              <b className="text-gray-800">Tipo de pago:</b>
                            </h6>
                            <h6 className="mb-0 mr-3">{pago.tipoPago}</h6>
                            <h6 className="mb-0 mr-3">
                              <b className="text-gray-800">Monto:</b>
                            </h6>
                            <h6 className="mb-0 mr-3">${pago.monto}</h6>
                            <h6 className="mb-0 mr-3">
                              <b className="text-gray-800">Fecha límite:</b>
                            </h6>
                            <h6 className="mb-0 mr-3">{pago.fechaLimitePago}</h6>
                            <h6 className="mb-0 mr-3">
                              <b className="text-gray-800">Estado:</b>
                            </h6>
                            <h6 className="mb-0 mr-3">
                              <span className="text-warning">Pendiente</span>
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};  