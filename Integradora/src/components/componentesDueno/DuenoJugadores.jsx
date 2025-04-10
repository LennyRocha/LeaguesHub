import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import {
  Button,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import userPlace from "../../assets/images/user-placeholder.png";

export default function DuenoJugadores({ cambiarComponente }) {
  const { getUserId, getToken, api_url } = useContext(AuthContext);
  const [equipos, setEquipos] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [selectedEquipo, setSelectedEquipo] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedJugador, setSelectedJugador] = useState(null);
  const [openDialogRegistrar, setOpenDialogRegistrar] = useState(false);
  const [openDialogDetalles, setOpenDialogDetalles] = useState(false);
  const [openDialogEditar, setOpenDialogEditar] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [reload, setReload] = useState(false);
  const [newJugador, setNewJugador] = useState({
    nombreCompleto: "",
    fechaNacimiento: "",
    numeroCamiseta: "",
  });

  const getUrl = (url) => {
    const match = url.match(/id=([^&]+)/);
    return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
  };

  useEffect(() => {
    const fetchEquipos = async () => {
      if (!getUserId() || !getToken()) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(
          `${api_url}/api/equipos/porDueno/${getUserId()}`,
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
        setEquipos(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error al cargar equipos:", err);
        setEquipos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipos();
  }, [api_url, getUserId, getToken]);

  useEffect(() => {
    if (!selectedEquipo) return;

    const fetchJugadores = async () => {
      if (!getUserId() || !getToken()) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(
          `${api_url}/api/jugadores/porEquipo/${selectedEquipo}`,
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
        setJugadores(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error al cargar jugadores:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al cargar los jugadores del equipo",
        });
        setJugadores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJugadores();
  }, [selectedEquipo, reload, api_url, getUserId, getToken]);

  const handleToggleEstatus = async (
    jugadorId,
    currentStatus,
    jugadorNombre
  ) => {
    try {
      const tokData = await getToken();
      const res = await axios.put(
        `${api_url}/api/jugadores/estatus/${jugadorId}`,
        { habilitado: !currentStatus }, // Cambiamos a 'habilitado' para coincidir con el API
        {
          headers: {
            Authorization: `Bearer ${tokData}`,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: `Jugador ${
          !currentStatus ? "habilitado" : "deshabilitado"
        } correctamente`,
        confirmButtonText: "Aceptar",
        customClass: {
          confirmButton: "btn-confirm",
        },
      });

      setReload((prev) => !prev);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 400) {
        Swal.fire({
          icon: "error",
          title: "¡Error!",
          text:
            err.response?.data?.message ||
            `No se pudo cambiar el estado de ${jugadorNombre}`,
          confirmButtonText: "Aceptar",
        });
        return;
      }

      if (err.response?.status === 403) {
        Swal.fire({
          icon: "warning",
          title: "¡Sesión expirada!",
          text: "Su sesión ha expirado, por favor ingrese nuevamente",
          confirmButtonText: "Aceptar",
        }).then(() => logout());
        return;
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error al cambiar el estado del jugador: ${err.message}`,
        confirmButtonText: "Aceptar",
      });
    }
  };
  const handleVerDetalles = (jugador) => {
    setSelectedJugador(jugador);
    setOpenDialogDetalles(true);
  };

  const handleCloseDetalles = () => {
    setSelectedJugador(null);
    setOpenDialogDetalles(false);
  };

  const handleRegisterJugador = async () => {
    if (
      !newJugador.nombreCompleto ||
      !newJugador.fechaNacimiento ||
      !newJugador.numeroCamiseta ||
      !selectedFile
    ) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos y selecciona una imagen.",
      });
      return;
    }

    const formData = new FormData();
    const jugadorData = {
      nombreCompleto: newJugador.nombreCompleto,
      fechaNacimiento: newJugador.fechaNacimiento,
      numero_camiseta: newJugador.numeroCamiseta,
      idEquipo: selectedEquipo,
    };

    const jugadorBlob = new Blob([JSON.stringify(jugadorData)], {
      type: "application/json",
    });
    formData.append("jugador", jugadorBlob, "jugador.json");
    formData.append("imagen", selectedFile);

    try {
      await axios.post(`${api_url}/api/jugadores`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Jugador registrado correctamente",
      });

      setNewJugador({
        nombreCompleto: "",
        fechaNacimiento: "",
        numeroCamiseta: "",
      });
      setSelectedFile(null);
      setOpenDialogRegistrar(false);
      setReload((prev) => !prev);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error al registrar jugador",
      });
    }
  };

  const handleEditJugador = async () => {
    if (
      !newJugador.nombreCompleto ||
      !newJugador.fechaNacimiento ||
      !newJugador.numeroCamiseta
    ) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos.",
      });
      return;
    }

    const formData = new FormData();
    const jugadorData = {
      nombreCompleto: newJugador.nombreCompleto,
      fechaNacimiento: newJugador.fechaNacimiento,
      numero_camiseta: newJugador.numeroCamiseta,
      idEquipo: selectedEquipo,
    };

    const jugadorBlob = new Blob([JSON.stringify(jugadorData)], {
      type: "application/json",
    });
    formData.append("jugador", jugadorBlob, "jugador.json");
    if (selectedFile) {
      formData.append("imagen", selectedFile);
    } else {
      formData.append("imagen", null);
    }

    try {
      await axios.put(
        `${api_url}/api/jugadores/${selectedJugador.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Jugador actualizado correctamente",
      });

      setReload((prev) => !prev);
      setOpenDialogEditar(false);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error al actualizar jugador",
      });
    }
  };

  const handleSelectEquipo = (e) => setSelectedEquipo(e.target.value);
  function getNum(num) {
    if (num < 10) {
      return `00${num}`;
    } else if (num > 100) {
      return `${num}`;
    } else {
      return `0${num}`;
    }
  }

  if (loading) return <div className="text-center py-4">Cargando...</div>;

  return (
    <div className="container-fluid">
      <div style={{ padding: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>Selecciona un equipo</h2>
          <Tooltip title="Regresar">
            <IconButton color="primary" onClick={() => cambiarComponente("A")}>
              <ArrowBackIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
          className="flex-grow flex-row d-flex"
        >
          <select
            value={selectedEquipo}
            onChange={handleSelectEquipo}
            style={{
              padding: "10px",
              fontSize: "18px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              cursor: "pointer",
              width: "30rem",
            }}
          >
            <option value="">Selecciona un equipo</option>
            {equipos.map((equipo) => (
              <option key={equipo.id} value={equipo.id}>
                {equipo.nombreEquipo}
              </option>
            ))}
          </select>

          {selectedEquipo && (
            <button
              className="slide-btn-sm d-md-block d-none text-black btn-players"
              onClick={() => setOpenDialogRegistrar(true)}
            >
              Agregar Jugador
            </button>
          )}
        </div>
        {selectedEquipo && (
          <button
            className="slide-btn-sm d-md-none d-block text-black btn-players w-100"
            onClick={() => setOpenDialogRegistrar(true)}
          >
            Agregar Jugador
          </button>
        )}

        {selectedEquipo && jugadores.length > 0 && (
          <div className="row">
            <div className="col-md-12">
              <div className="players-grid">
                {jugadores.map((jugador) => (
                  <div className="over-card" key={jugador.id}>
                    <div className="kard">
                      <div className="face card-front">
                        <div
                          className={`front-head ${
                            jugador.habilitado ? "aktive" : "inactive"
                          }`}
                        >
                          <img
                            src={getUrl(jugador.fotoJugador) || userPlace}
                            alt={jugador.nombreCompleto}
                            className="jugImg"
                          />
                        </div>
                        <h6 className="h_tz f-col text-center px-2 w-75">
                          {jugador.nombreCompleto}
                        </h6>
                        <p className="text-muted">
                          #{getNum(jugador.numeroCamiseta)}
                        </p>
                        <div
                          className={`mini-alert ${
                            jugador.habilitado
                              ? "aktive activeTxt"
                              : "inactive inactiveTxt"
                          }`}
                        >
                          {jugador.habilitado ? "Activo" : "Inactivo"}
                        </div>
                      </div>
                      <div className="face card-back _col">
                        <h3>Opciones</h3>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                          }}
                        >
                          <span>Activo:</span>
                          <Switch
                            checked={jugador.habilitado || false}
                            onChange={() =>
                              handleToggleEstatus(
                                jugador.id,
                                jugador.habilitado,
                                jugador.nombreCompleto
                              )
                            }
                            color="success"
                          />
                        </div>
                        <div className="d-flex-row gap-5">
                          <a
                            className="link mx-1"
                            onClick={() => handleVerDetalles(jugador)}
                          >
                            Detalles
                          </a>
                          <a
                            className="link mx-1"
                            onClick={() => {
                              setSelectedJugador(jugador);
                              setNewJugador({
                                nombreCompleto: jugador.nombreCompleto,
                                fechaNacimiento: jugador.fechaNacimiento,
                                numeroCamiseta: jugador.numeroCamiseta,
                              });
                              setOpenDialogEditar(true);
                            }}
                          >
                            Editar
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  /*
                   <div
                    key={jugador.id}
                    style={{
                      backgroundColor: "#f8f9fa",
                      padding: "15px",
                      borderRadius: "8px",
                      width: "200px",
                      textAlign: "center",
                      cursor: "pointer",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.3s ease",
                    }}
                  >
                    <img
                      src={getUrl(jugador.fotoJugador) || userPlace}
                      alt={jugador.nombreCompleto}
                      style={{
                        height: "100px",
                        width: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    />
                    <h5>{jugador.nombreCompleto}</h5>
                    <p className="text-muted">{jugador.numeroCamiseta}</p>
                    <div>
                      <Button
                        variant="contained"
                        style={{ backgroundColor: "#FF5958", color: "white", marginBottom: 5 }}
                        onClick={() => handleVerDetalles(jugador)}
                      >
                        Ver Detalles
                      </Button>
                      <Button
                        variant="contained"
                        style={{ backgroundColor: "#FF5958", color: "white", marginBottom: 5 }}
                        onClick={() => {
                          setSelectedJugador(jugador);
                          setNewJugador({
                            nombreCompleto: jugador.nombreCompleto,
                            fechaNacimiento: jugador.fechaNacimiento,
                            numeroCamiseta: jugador.numeroCamiseta,
                          });
                          setOpenDialogEditar(true);
                        }}
                      >
                        Editar
                      </Button>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                        <span>Activo:</span>
                        <Switch
  checked={jugador.habilitado || false}
  onChange={() => handleToggleEstatus(jugador.id, jugador.habilitado, jugador.nombreCompleto)}
  color="primary"
/>
                      </div>
                    </div>
                  </div>
                   */
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal Registrar Jugador */}
        <Dialog
          open={openDialogRegistrar}
          onClose={() => setOpenDialogRegistrar(false)}
        >
          <DialogTitle>Agregar Jugador</DialogTitle>
          <DialogContent>
            <TextField
            label="Nombre completo"
            className="txtAr"
              type="text"
              placeholder="Nombre Completo"
              value={newJugador.nombreCompleto}
              onChange={(e) =>
                setNewJugador({ ...newJugador, nombreCompleto: e.target.value })
              }
              style={{
                width: "100%",
                marginBottom: "10px",
                backgroundColor: "white",
                borderRadius: 5,
              }}
            />
            <input
              type="date"
              value={newJugador.fechaNacimiento}
              onChange={(e) =>
                setNewJugador({
                  ...newJugador,
                  fechaNacimiento: e.target.value,
                })
              }
              style={{
                width: "100%",
                marginBottom: "10px",
                backgroundColor: "white",
                borderRadius: 5,
              }}
            />
            <input
              type="number"
              placeholder="Número de Camiseta"
              value={newJugador.numeroCamiseta}
              onChange={(e) =>
                setNewJugador({ ...newJugador, numeroCamiseta: e.target.value })
              }
              style={{
                width: "100%",
                marginBottom: "10px",
                backgroundColor: "white",
                borderRadius: 5,
              }}
            />
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Vista previa"
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleRegisterJugador}
              style={{ backgroundColor: "#FF5958", color: "white" }}
            >
              Registrar
            </Button>
            <Button
              onClick={() => setOpenDialogRegistrar(false)}
              style={{ backgroundColor: "#ccc" }}
            >
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal Editar Jugador */}
        <Dialog
          open={openDialogEditar}
          onClose={() => setOpenDialogEditar(false)}
        >
          <DialogTitle>Editar Jugador</DialogTitle>
          <DialogContent className="quitarScroll">
            <TextField
            label="Nombre completo"
              type="text"
              placeholder="Nombre Completo"
              value={newJugador.nombreCompleto}
              className="txtAr"
              onChange={(e) =>
                setNewJugador({ ...newJugador, nombreCompleto: e.target.value })
              }
              style={{
                width: "100%",
                marginBottom: "10px",
                backgroundColor: "white",
                borderRadius: 5,
              }}
            />
            <TextField
              label="Fecha de nacimiento"
              type="date"
              className="txtAr"
              value={newJugador.fechaNacimiento}
              onChange={(e) =>
                setNewJugador({
                  ...newJugador,
                  fechaNacimiento: e.target.value,
                })
              }
              style={{
                width: "100%",
                marginBottom: "10px",
                backgroundColor: "white",
                borderRadius: 5,
              }}
            />
            <TextField
            label="# de camiseta"
            className="txtAr"
              type="number"
              placeholder="Número de Camiseta"
              value={newJugador.numeroCamiseta}
              onChange={(e) =>
                setNewJugador({ ...newJugador, numeroCamiseta: e.target.value })
              }
              style={{
                width: "100%",
                marginBottom: "10px",
                backgroundColor: "white",
                borderRadius: 5,
              }}
            />
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            {selectedJugador?.fotoJugador || selectedFile ? (
              <img
                src={
                  selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : getUrl(selectedJugador.fotoJugador)
                }
                alt="Vista previa"
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              />
            ) : null}
          </DialogContent>
          <DialogActions>
            <button
              onClick={handleEditJugador}
              className="slide-btn-sm w-50 text-black"
            >
              Guardar Cambios
            </button>
            <button
              onClick={() => setOpenDialogEditar(false)}
              className="slide-btn-sm w-50 text-black"
            >
              Cancelar
            </button>
          </DialogActions>
        </Dialog>

        {/* Modal Ver Detalles */}
        <Dialog open={openDialogDetalles} onClose={handleCloseDetalles}>
          <DialogTitle className="nunito">Detalles del Jugador</DialogTitle>
          <DialogContent className="quitarScroll">
            {selectedJugador && (
              <div>
                <img
                  src={getUrl(selectedJugador.fotoJugador) || userPlace}
                  alt={selectedJugador.nombreCompleto}
                  style={{
                    width: "100%",
                    maxHeight: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                />
                <p>
                  <strong>Nombre:</strong> {selectedJugador.nombreCompleto}
                </p>
                <p>
                  <strong>Fecha de nacimiento:</strong>{" "}
                  {selectedJugador.fechaNacimiento}
                </p>
                <p>
                  <strong>Número de camiseta:</strong>{" "}
                  {selectedJugador.numeroCamiseta}
                </p>
                <p>
                  <strong>Estatus:</strong>{" "}
                  {selectedJugador.habilitado ? "Habilitado" : "Deshabilitado"}
                </p>
                <p>
                  <strong>Partidos Jugados:</strong>{" "}
                  {selectedJugador.partidosJugados}
                </p>
                <p>
                  <strong>Expulsado:</strong>{" "}
                  {selectedJugador.expulsado ? "Sí" : "No"}
                </p>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <button
              onClick={handleCloseDetalles}
              className="slide-btn-sm-green text-black"
            >
              Cerrar
            </button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
