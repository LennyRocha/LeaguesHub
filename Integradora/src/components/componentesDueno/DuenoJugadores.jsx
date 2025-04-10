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
  Switch
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

  const handleToggleEstatus = async (jugadorId, currentStatus, jugadorNombre) => {
    try {
      const tokData = await getToken();
      const res = await axios.put(
        `${api_url}/api/jugadores/estatus/${jugadorId}`,
        { habilitado: !currentStatus },  // Cambiamos a 'habilitado' para coincidir con el API
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
        text: `Jugador ${!currentStatus ? 'habilitado' : 'deshabilitado'} correctamente`,
        confirmButtonText: "Aceptar",
        customClass: {
          confirmButton: "btn-confirm",
        },
      });
  
      setReload(prev => !prev);
      
    } catch (err) {
      console.error(err);
      
      if (err.response?.status === 400) {
        Swal.fire({
          icon: "error",
          title: "¡Error!",
          text: err.response?.data?.message || `No se pudo cambiar el estado de ${jugadorNombre}`,
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

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
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
            <Button
              variant="contained"
              onClick={() => setOpenDialogRegistrar(true)}
              style={{
                backgroundColor: "#FF5958",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Agregar Jugador
            </Button>
          )}
        </div>

        {selectedEquipo && jugadores.length > 0 && (
          <div className="row">
            <div className="col-md-12">
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {jugadores.map((jugador) => (
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
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal Registrar Jugador */}
        <Dialog open={openDialogRegistrar} onClose={() => setOpenDialogRegistrar(false)}>
          <DialogTitle>Agregar Jugador</DialogTitle>
          <DialogContent>
            <input
              type="text"
              placeholder="Nombre Completo"
              value={newJugador.nombreCompleto}
              onChange={(e) =>
                setNewJugador({ ...newJugador, nombreCompleto: e.target.value })
              }
              style={{ width: "100%", marginBottom: "10px", backgroundColor: "white", borderRadius: 5 }}
            />
            <input
              type="date"
              value={newJugador.fechaNacimiento}
              onChange={(e) =>
                setNewJugador({ ...newJugador, fechaNacimiento: e.target.value })
              }
              style={{ width: "100%", marginBottom: "10px", backgroundColor: "white", borderRadius: 5 }}
            />
            <input
              type="number"
              placeholder="Número de Camiseta"
              value={newJugador.numeroCamiseta}
              onChange={(e) =>
                setNewJugador({ ...newJugador, numeroCamiseta: e.target.value })
              }
              style={{ width: "100%", marginBottom: "10px", backgroundColor: "white", borderRadius: 5 }}
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
        <Dialog open={openDialogEditar} onClose={() => setOpenDialogEditar(false)}>
          <DialogTitle>Editar Jugador</DialogTitle>
          <DialogContent>
            <input
              type="text"
              placeholder="Nombre Completo"
              value={newJugador.nombreCompleto}
              onChange={(e) =>
                setNewJugador({ ...newJugador, nombreCompleto: e.target.value })
              }
              style={{ width: "100%", marginBottom: "10px", backgroundColor: "white", borderRadius: 5 }}
            />
            <input
              type="date"
              value={newJugador.fechaNacimiento}
              onChange={(e) =>
                setNewJugador({ ...newJugador, fechaNacimiento: e.target.value })
              }
              style={{ width: "100%", marginBottom: "10px", backgroundColor: "white", borderRadius: 5 }}
            />
            <input
              type="number"
              placeholder="Número de Camiseta"
              value={newJugador.numeroCamiseta}
              onChange={(e) =>
                setNewJugador({ ...newJugador, numeroCamiseta: e.target.value })
              }
              style={{ width: "100%", marginBottom: "10px", backgroundColor: "white", borderRadius: 5 }}
            />
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            {selectedJugador?.fotoJugador || selectedFile ? (
              <img
                src={selectedFile ? URL.createObjectURL(selectedFile) : getUrl(selectedJugador.fotoJugador)}
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
            <Button
              onClick={handleEditJugador}
              style={{ backgroundColor: "#FF5958", color: "white" }}
            >
              Guardar Cambios
            </Button>
            <Button
              onClick={() => setOpenDialogEditar(false)}
              style={{ backgroundColor: "#ccc" }}
            >
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal Ver Detalles */}
        <Dialog open={openDialogDetalles} onClose={handleCloseDetalles}>
          <DialogTitle>Detalles del Jugador</DialogTitle>
          <DialogContent>
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
                <p><strong>Nombre:</strong> {selectedJugador.nombreCompleto}</p>
                <p><strong>Fecha de nacimiento:</strong> {selectedJugador.fechaNacimiento}</p>
                <p><strong>Número de camiseta:</strong> {selectedJugador.numeroCamiseta}</p>
                <p><strong>Estatus:</strong> {selectedJugador.habilitado ? "Habilitado" : "Deshabilitado"}</p>       
                   <p><strong>Partidos Jugados:</strong> {selectedJugador.partidosJugados}</p>
                <p><strong>Expulsado:</strong> {selectedJugador.expulsado ? "Sí" : "No"}</p>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDetalles}
              style={{ backgroundColor: "#ccc" }}
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}