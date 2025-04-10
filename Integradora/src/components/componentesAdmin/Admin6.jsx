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
  const [payments, setPayments] = useState([]);
  const [loadPayments, setLoadPayments] = useState(false);
  const [reloadPayments, setReloadPayments] = useState(false);

  const changePay = (tipo) => {
    let respuesta = "";
    Swal.fire({
      title: `Ingresa el nuevo monto para el pago de ${tipo}`,
      input: "number",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      customClass: {
        confirmButton: "btn-confirm",
        cancelButton: "btn-cancel",
        denyButton: "btn-deny",
      },
      preConfirm: async (monto) => {
        try {
          const token = await getToken();
          const response = await axios.put(
            `${api_url}/api/pagos/admin/precios/${tipo}/${monto}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          respuesta = response.data;
        } catch (error) {
          Swal.showValidationMessage(`
            Error al actualizar el precio: ${error}
          `);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `¡Operación exitosa!`,
          text: `${respuesta}`,
          customClass: {
            confirmButton: "btn-confirm",
            cancelButton: "btn-cancel",
            denyButton: "btn-deny",
          },
        });
      }
      setReloadPayments(!reloadPayments);
    });
  };

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
        console.error(error);
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
      });
  };

  const getPayments = async () => {
    setLoadPayments(true);
    await axios
      .get(`${api_url}/api/pagos/todos/precios`)
      .then((res) => setPayments(res.data))
      .catch((err) => {
        console.error(err);
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
        }
      })
      .finally(() => setLoadPayments(false));
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
    getPayments();
  }, [reload, reloadPayments]);

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

  const [check, setCheck] = useState(false);

  return (
    <div>
      <div className="container-fluid">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              Pagos
            </li>
            <li className={`breadcrumb-item ${!check && 'active'}`}>
              <a
                onClick={() => {
                  setCheck(false);
                }}
                className="link"
              >
                Lista de pagos
              </a>
            </li>
            <li className={`breadcrumb-item ${check && 'active'}`}>
              <a
                onClick={() => {
                  setCheck(true);
                }}
                className="link"
              >
                Precios de pagos
              </a>
            </li>
          </ol>
        </nav>

        <div className="d-flex flex-row align-items-center justify-content-left gap-1 mb-4">
          <h2 className="mb-0">Menú de pagos</h2>
          {/* <IconButton onClick={() => setCheck(!check)}>
            <Edit color="primary" />
          </IconButton> */}
        </div>
        {!check ? (
          <div>
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
                  {(selectedValue === "todos" ||
                    selectedValue === "estado") && (
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

                  {(selectedValue === "todos" ||
                    selectedValue === "torneo") && (
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

                  {(selectedValue === "todos" ||
                    selectedValue === "equipos") && (
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
                          <TableCell className="no-cell">
                            {pago.tipoPago}
                          </TableCell>
                          <TableCell className="no-cell">
                            {pago.estatusPago ? "Pagado" : "Pendiente"}
                          </TableCell>
                          <TableCell className="no-cell">
                            {pago.equipo.nombreEquipo}
                          </TableCell>
                          <TableCell>
                            {pago.estatusPago ? (
                              <p className="text-exito text-center oswald">
                                ¡Pagado!
                              </p>
                            ) : (
                              <button
                                className="slide-btn-sm w-100 text-black but-black"
                                onClick={() => confirm(pago.id)}
                              >
                                Confirmar
                              </button>
                            )}
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
                    className={`p-0 pag-btn ${
                      paginaActual === 1 ? "opa-0" : ""
                    }`}
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
                <h3>
                  {fallo === "Error al obtener pagos" ? "¡Oh oh!" : "¡Yuju!"}
                </h3>
                <h5>{fallo}</h5>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3>Precios de pagos</h3>
            <div class="row row-cols-1 row-cols-md-3 mb-3 text-center">
              <div class="col">
                <div class="card mb-4 rounded-3 shadow-sm pay-card">
                  <div class="card-header py-3 pay-head">
                    <h4 class="my-0 text-white">{payments[0].tipoPago}</h4>
                  </div>
                  <div class="card-body">
                    <h2 class="card-title pricing-card-title">
                      ${payments[0].monto}
                    </h2>
                    <ul class="list-unstyled mt-3 mb-4">
                      <li>10 users included</li>
                      <li>2 GB of storage</li>
                      <li>Email support</li>
                      <li>Help center access</li>
                    </ul>
                    <button
                      type="button"
                      class="w-100 btn btn-lg btn-outline-danger"
                      onClick={() => changePay(payments[0].tipoPago)}
                    >
                      Modificar
                    </button>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card mb-4 rounded-3 shadow-sm pay-card">
                  <div class="card-header py-3 pay-head">
                    <h4 class="my-0 text-white">{payments[1].tipoPago}</h4>
                  </div>
                  <div class="card-body">
                    <h2 class="card-title pricing-card-title">
                      ${payments[1].monto}
                    </h2>
                    <ul class="list-unstyled mt-3 mb-4">
                      <li>20 users included</li>
                      <li>10 GB of storage</li>
                      <li>Priority email support</li>
                      <li>Help center access</li>
                    </ul>
                    <button
                      type="button"
                      class="w-100 btn btn-lg btn-outline-danger"
                      onClick={() => changePay(payments[1].tipoPago)}
                    >
                      Modificar
                    </button>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card mb-4 rounded-3 shadow-sm pay-card">
                  <div class="card-header py-3 pay-head">
                    <h4 class="my-0 text-white">{payments[2].tipoPago}</h4>
                  </div>
                  <div class="card-body">
                    <h2>${payments[2].monto}</h2>
                    <ul class="list-unstyled mt-3 mb-4">
                      <li>30 users included</li>
                      <li>15 GB of storage</li>
                      <li>Phone and email support</li>
                      <li>Help center access</li>
                    </ul>
                    <button
                      type="button"
                      class="w-100 btn btn-lg btn-outline-danger"
                      onClick={() => changePay(payments[2].tipoPago)}
                    >
                      Modificar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
