import React from "react";
import LoadingScreen from "../LoadingScreen";

export default function Admin6() {
  return (
    <div>
      <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0">Menú de pagos</h2>
        </div>
        <LoadingScreen />
      </div>
    </div>
  );
}

/*
import React, { useState, useEffect } from "react";

const App = () => {
  const [pagos, setPagos] = useState([]); // Lista completa de pagos
  const [pagosFiltrados, setPagosFiltrados] = useState([]); // Lista filtrada
  const [torneoId, setTorneoId] = useState("");
  const [equipoId, setEquipoId] = useState("");
  const [tipoPago, setTipoPago] = useState("todos");
  const [estadoPago, setEstadoPago] = useState("todos");
  const [pagina, setPagina] = useState(0);
  const pagosPorPagina = 10; // Cantidad de pagos por página

  // 🚀 Cargar todos los pagos al iniciar la aplicación
  useEffect(() => {
    cargarPagos();
  }, []);

  // 🚀 Filtrar pagos cuando cambien los filtros
  useEffect(() => {
    filtrarPagos();
  }, [torneoId, equipoId, tipoPago, estadoPago, pagos]);

  const cargarPagos = async () => {
    try {
      const response = await fetch(http://localhost:8080/api/pagos/admin/todos, {
        method: "GET",
        credentials: "include", // Necesario si usas autenticación
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los pagos");
      }

      const data = await response.json();
      setPagos(data); // Guardamos todos los pagos
    } catch (error) {
      console.error("Error cargando pagos", error);
    }
  };

  const filtrarPagos = () => {
    let filtrados = [...pagos]; // Copia de la lista de pagos

    // Filtrar por torneo
    if (torneoId.trim() !== "") {
      filtrados = filtrados.filter((pago) => pago.torneoId?.toString() === torneoId);
    }

    // Filtrar por equipo
    if (equipoId.trim() !== "") {
      filtrados = filtrados.filter((pago) => pago.equipo?.id?.toString() === equipoId);
    }

    // Filtrar por estado de pago
    if (estadoPago === "pendientes") {
      filtrados = filtrados.filter((pago) => pago.estatusPago === false);
    } else if (estadoPago === "confirmados") {
      filtrados = filtrados.filter((pago) => pago.estatusPago === true);
    }

    // Filtrar por tipo de pago
    if (tipoPago !== "todos") {
      filtrados = filtrados.filter((pago) => pago.tipoPago === tipoPago);
    }

    setPagosFiltrados(filtrados);
    setPagina(0); // Reiniciar a la primera página
  };

  // 🚀 Paginación en el frontend: mostrar solo los pagos de la página actual
  const pagosPaginados = pagosFiltrados.slice(pagina * pagosPorPagina, (pagina + 1) * pagosPorPagina);
  const totalPaginas = Math.ceil(pagosFiltrados.length / pagosPorPagina);

  return (
    <div>
      <h2>Pagos</h2>
      <div>
        <label>Torneo:</label>
        <input type="text" value={torneoId} onChange={(e) => setTorneoId(e.target.value)} placeholder="ID Torneo" />

        <label>Equipo:</label>
        <input type="text" value={equipoId} onChange={(e) => setEquipoId(e.target.value)} placeholder="ID Equipo" />

        <label>Tipo de Pago:</label>
        <select value={tipoPago} onChange={(e) => setTipoPago(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="Inscripción">Inscripción</option>
          <option value="Arbitraje">Arbitraje</option>
          <option value="Cancha">Cancha</option>
        </select>

        <label>Estado de Pago:</label>
        <select value={estadoPago} onChange={(e) => setEstadoPago(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="pendientes">Pendientes</option>
          <option value="confirmados">Confirmados</option>
        </select>
      </div>

      <button onClick={() => setPagina((prev) => Math.max(prev - 1, 0))} disabled={pagina === 0}>
        Anterior
      </button>
      <button onClick={() => setPagina((prev) => (prev < totalPaginas - 1 ? prev + 1 : prev))} disabled={pagina >= totalPaginas - 1}>
        Siguiente
      </button>

      <table>
  <thead>
    <tr>
      <th>Descripción</th>
      <th>Tipo de Pago</th>
      <th>Monto</th>
      <th>Equipo</th>
      <th>Estado</th>
      <th>Fecha Límite</th>
      <th>ID Equipo</th>
      <th>Nombre Equipo</th>
    </tr>
  </thead>
  <tbody>
    {pagosPaginados.map((pago) => (
      <tr key={pago.id}>
        <td>{pago.descripcion}</td>
        <td>{pago.tipoPago}</td>
        <td>${pago.monto.toFixed(2)}</td>
        <td>{pago.equipo?.nombreEquipo || "N/A"}</td>
        <td>{pago.estatusPago ? "Pagado" : "Pendiente"}</td>
        <td>{pago.fechaLimitePago}</td>
        <td>{pago.equipo?.id || "N/A"}</td>
        <td>{pago.equipo?.nombreEquipo || "N/A"}</td>
      </tr>
    ))}
  </tbody>
</table>

      <p>Página {pagina + 1} de {totalPaginas}</p>
    </div>
  );
};

export default App;
 */