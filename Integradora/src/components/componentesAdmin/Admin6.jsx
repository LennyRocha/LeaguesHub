import { useRef, useState, useEffect, useContext } from "react";
import React from "react";
import LoadingScreen from "../LoadingScreen";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import {
  GridView,
  CreditCard,
  SportsSoccer,
  EmojiEvents,
  CheckCircle,
} from "@mui/icons-material";
import { Edit, Delete, Map, FilterList } from "@mui/icons-material";
import Swal from "sweetalert2";

export default function Admin6() {
  const { getUserId, getUserRole, getToken, logout, api_url, getUrl } =
    useContext(AuthContext);

  const [refreshing, setRefreshing] = useState(false);

  const handleAlignment = (event, newAlignment) => {
    setSelectedValue(newAlignment);
  };

  const [tipoPago, setTipoPago] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [torneoFiltro, setTorneoFiltro] = useState("");
  const [equipoFiltro, setEquipoFiltro] = useState("");
  const [listaPagos, setPagos] = useState([]);
  const [loadPagos, setLoadPagos] = useState(false);
  const [fallo, setFallo] = useState("");
  const [tokData, setTokData] = useState("");
  const [reload, setReload] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [id, setId] = useState(0);

  const confirmarPago = async (id) => {
    const tokData = await getToken();
    await axios
      .put(
        `${api_url}/api/pagos/admin/confirmar/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokData}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        Swal.fire({
          icon: "success",
          title: "¡OK!",
          text: res.data || `Pago procesado con 'exito`,
          customClass: {
            confirmButton: "btn-confirm",
            cancelButton: "btn-cancel",
            denyButton: "btn-deny",
          },
        });
        setReload(!reload);
      })
      .catch((error) => {
        console.error(error, error.response?.data?.message);
        console.log(error.toJSON());
        if (error.response?.status === 403) {
          console.log("⚠️ Token expirado, redirigiendo a login...");
          Swal.fire({
            icon: "warning",
            title: "¡Denegado!",
            text: "Su sesión ha expirado, ingrese sesión nuevamente para continuar",
            confirmButtonText: "Aceptar",
            customClass: {
              confirmButton: "btn-confirm",
              cancelButton: "btn-cancel",
              denyButton: "btn-deny",
            },
          }).then((resutlt) => logout());
          return;
        } else {
          Swal.fire({
            icon: "warning",
            title: "¡Denegado!",
            text:
              error.response?.message || "Algo salió mal, intentalo nuevamente",
            confirmButtonText: "Aceptar",
            customClass: {
              confirmButton: "btn-confirm",
              cancelButton: "btn-cancel",
              denyButton: "btn-deny",
            },
          });
        }
      })
      .finally(() => {
        setModalVisible1(false);
        setId(0);
      });
  };

  useEffect(() => {
    const getPagos = async () => {
      const id = await getUserRole();
      const rolo = await getUserId();
      const tok = await getToken();
      setTokData(tok);
      setLoadPagos(true);
      axios
        .get(`${api_url}/api/pagos/admin/todos`, {
          headers: {
            Authorization: `Bearer ${tok}`,
          },
        })
        .then((res) => {
          if (res.data.length === 0)
            setFallo(
              "No hay pagos pendientes, los usuarios están al corriente"
            );
          else setPagos(res.data);
        })
        .catch((e) => {
          console.error(e, e.response.message);
          if (e.response?.status === 403) {
            console.log("⚠️ Token expirado, redirigiendo a login...");
            Swal.fire({
              icon: "warning",
              title: "¡Denegado!",
              text: "Su sesión ha expirado, ingrese sesión nuevamente para continuar",
              confirmButtonText: "Aceptar",
              customClass: {
                confirmButton: "btn-confirm",
                cancelButton: "btn-cancel",
                denyButton: "btn-deny",
              },
            }).then((resutlt) => logout());
            return;
          } else setFallo("Error al obtener pagos");
        })
        .finally(() => setLoadPagos(false));
    };
    getPagos();
  }, [reload]);

  // Extraer torneos únicos de la lista de pagos
  const torneosUnicos = [
    ...new Set(listaPagos.map((pago) => pago.descripcion)),
  ];

  // Extraer equipos únicos de la lista de pagos
  const equiposUnicos = [
    ...new Set(listaPagos.map((pago) => pago.equipo.nombreEquipo)),
  ];

  // Filtrado de pagos según selecciones
  const pagosFiltrados = listaPagos.filter((pago) => {
    return (
      (!tipoPago || pago.tipoPago === tipoPago) &&
      (!estadoFiltro ||
        (estadoFiltro === "Pagado" && pago.estatusPago) ||
        (estadoFiltro === "Pendiente" && !pago.estatusPago)) &&
      (!torneoFiltro || pago.descripcion === torneoFiltro) &&
      (!equipoFiltro || pago.equipo.nombreEquipo === equipoFiltro)
    );
  });

  const [selectedValue, setSelectedValue] = useState("todos");

  // Estado para la página actual
  const [paginaActual, setPaginaActual] = useState(1);
  const resultadosPorPagina = 4;

  // Calcular el índice de inicio y fin de los resultados
  const indiceInicio = (paginaActual - 1) * resultadosPorPagina;
  const indiceFin = indiceInicio + resultadosPorPagina;
  const totalPaginas = Math.ceil(pagosFiltrados.length / resultadosPorPagina);

  // Pagos que se mostrarán en la página actual
  const pagosPagina = pagosFiltrados.slice(indiceInicio, indiceFin);

  // Función para cambiar de página
  const siguientePagina = () => {
    if (paginaActual * resultadosPorPagina < pagosFiltrados.length) {
      setPaginaActual(paginaActual + 1);
    }
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  function confirm(id) {
    console.log(id);
    Swal.fire({
      icon: "info",
      title: "Confirmación",
      text: "¿Confirmas que el pago se ha realizaado?",
      confirmButtonText: "Aceptar",
      customClass: {
        confirmButton: "btn-confirm",
        cancelButton: "btn-cancel",
        denyButton: "btn-deny",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        confirmarPago(id);
      }
    });
  }

  return (
    <div>
      <div className="container-fluid">
        <div className="d-flex flex-row align-items-center justify-content-left gap-1 mb-4">
          <h2 className="mb-0">Menú de pagos</h2>
          <IconButton>
            <Edit color="primary" />
          </IconButton>
        </div>
        {loadPagos ? (
          <div className="centered-div w-100 cont">
            <div className="my-spinner"></div>
          </div>
        ) : fallo === "" ? (
          <div>
            <div className="toggle-lista flex-md-row flex-wrap d-flex gap-3 justify-content-left align-items-center w-100 mb-3">
              <FilterList fontSize="medium" />
              <h5 className="mb-0">Filtrar por: {selectedValue}</h5>
              <ToggleButtonGroup
                value={selectedValue}
                exclusive
                onChange={handleAlignment}
              >
                <ToggleButton value="todos">
                  <GridView />
                </ToggleButton>
                <ToggleButton value="tipo de pago">
                  <CreditCard />
                </ToggleButton>
                <ToggleButton value="estado">
                  <CheckCircle />
                </ToggleButton>
                <ToggleButton value="torneo">
                  <EmojiEvents />
                </ToggleButton>
                <ToggleButton value="equipos">
                  <SportsSoccer />
                </ToggleButton>
              </ToggleButtonGroup>
            </div>

            <div className="flex-row d-flex flex-wrap w-100 gap-3">
              {(selectedValue === "todos" ||
                selectedValue === "tipo de pago") && (
                <div>
                  {/* Picker Tipo de Pago */}
                  <h5>Tipo de Pago:</h5>
                  <select
                    value={tipoPago}
                    onChange={(e) => setTipoPago(e.target.value)}
                    className="text-black mb-2"
                  >
                    <option value="">Todos</option>
                    <option value="Inscripcion">Inscripción</option>
                    <option value="Arbitraje">Arbitraje</option>
                    <option value="Cancha">Cancha</option>
                  </select>
                </div>
              )}
              {(selectedValue === "todos" || selectedValue === "estado") && (
                <div>
                  {/* Picker Estado */}
                  <h5>Estado:</h5>
                  <select
                    value={estadoFiltro}
                    onChange={(e) => setEstadoFiltro(e.target.value)}
                    className="text-black mb-2"
                  >
                    <option value="">Todos</option>
                    <option value="Pagado">Pagado</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>
              )}

              {(selectedValue === "todos" || selectedValue === "torneo") && (
                <div>
                  {/* Picker Torneo */}
                  <h5>Torneo:</h5>
                  <select
                    value={torneoFiltro}
                    onChange={(e) => setTorneoFiltro(e.target.value)}
                    className="text-black mb-2"
                  >
                    <option value="">Todos</option>
                    {torneosUnicos.map((torneo, index) => (
                      <option key={index} value={torneo}>
                        {torneo}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(selectedValue === "todos" || selectedValue === "equipos") && (
                <div>
                  {/* Picker Equipo */}
                  <h5>Equipo:</h5>
                  <select
                    value={equipoFiltro}
                    onChange={(e) => setEquipoFiltro(e.target.value)}
                    className="text-black mb-2"
                  >
                    <option value="">Todos</option>
                    {equiposUnicos.map((equipo, index) => (
                      <option key={index} value={equipo}>
                        {equipo}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <TableContainer component={Paper} className="my-1">
              <Table>
                <TableHead className="myThead">
                  <TableRow>
                    <TableCell className="cell">Descripción</TableCell>
                    <TableCell className="cell">Tipo de pago</TableCell>
                    <TableCell className="cell">Estado</TableCell>
                    <TableCell className="cell">Equipo</TableCell>
                    <TableCell className="cell">Opciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagosPagina.map((pago) => (
                    <TableRow key={pago.id}>
                      <TableCell className="no-cell">
                        {pago.descripcion}
                      </TableCell>
                      <TableCell className="no-cell">{pago.tipoPago}</TableCell>
                      <TableCell className="no-cell">
                        {pago.estatusPago ? "Pagado" : "Pendiente"}
                      </TableCell>
                      <TableCell className="no-cell">
                        {pago.equipo.nombreEquipo}
                      </TableCell>
                      <TableCell>
                        <button
                          className="slide-btn-sm w-100 text-black but-black"
                          onClick={() => confirm(pago.id)}
                        >
                          Confirmar
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="flex-row gap-2 d-flex w-100 align-items-center justify-content-center">
              <button
                onClick={paginaAnterior}
                disabled={paginaActual === 1}
                className={`p-0 pag-btn ${paginaActual === 1 ? "opa-0" : ""}`}
              >
                <ArrowLeftIcon fontSize="large" />
              </button>
              <span>
                Página {paginaActual} de {totalPaginas}
              </span>
              <button
                onClick={siguientePagina}
                disabled={indiceFin >= pagosFiltrados.length}
                className={`p-0 pag-btn ${
                  indiceFin >= pagosFiltrados.length === 1 ? "opa-0" : ""
                }`}
              >
                <ArrowRightIcon fontSize="large" />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-100 align-items-center d-flex flex-column gap-1">
            <lord-icon
              id="input-icon-2"
              src={
                fallo === "Error al obtener pagos"
                  ? "/icons/puerco.json"
                  : "/icons/confetti.json"
              }
              trigger="loop"
              stroke="bold"
              state={
                fallo === "Error al obtener pagos"
                  ? "morph-destroyed"
                  : "in-reveal"
              }
              colors="primary:#333333,secondary:#9A0000"
              style={{ width: "15em", height: "15em" }}
            ></lord-icon>
            <h3>{fallo === "Error al obtener pagos" ? "¡Oh oh!" : "¡Yuju!"}</h3>
            <h5>{fallo}</h5>
          </div>
        )}
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
